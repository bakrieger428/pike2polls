/**
 * Persistent Rider Grouping Algorithm
 *
 * This module provides proximity-based grouping of riders with database persistence.
 * Groups are saved to the database and reused when the same signups are grouped again.
 */

import { geocodeAddress, calculateDistance, calculateCenter } from './mapbox';
import { supabase, TABLES, type Signup } from './supabase';

interface RiderWithCoords extends Signup {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface RiderGroupWithRiders {
  id: string;
  voting_date: string;
  preferred_time: string;
  group_name?: string;
  riders: RiderWithCoords[];
  centerLat: number;
  centerLon: number;
  riderCount: number;
}

async function saveGroupsToDatabase(groups: RiderGroupWithRiders[]): Promise<void> {
  for (const group of groups) {
    const { data: existing } = await supabase
      .from(TABLES.RIDER_GROUPS)
      .select('id')
      .eq('voting_date', group.voting_date)
      .eq('preferred_time', group.preferred_time)
      .eq('group_name', group.group_name || '')
      .maybeSingle();

    const groupId = existing?.id || crypto.randomUUID();

    if (!existing) {
      await supabase
        .from(TABLES.RIDER_GROUPS)
        .insert({
          id: groupId,
          voting_date: group.voting_date,
          preferred_time: group.preferred_time,
          group_name: group.group_name,
        });
    }

    await supabase
      .from(TABLES.GROUP_MEMBERS)
      .delete()
      .eq('group_id', groupId);

    const members = group.riders.map((rider) => ({
      group_id: groupId,
      signup_id: rider.id,
    }));

    if (members.length > 0) {
      await supabase
        .from(TABLES.GROUP_MEMBERS)
        .insert(members);
    }
  }
}

async function loadGroupsFromDatabase(signupIds: string[]): Promise<RiderGroupWithRiders[] | null> {
  const { data: members } = await supabase
    .from(TABLES.GROUP_MEMBERS)
    .select('group_id, signup_id')
    .in('signup_id', signupIds);

  if (!members || members.length === 0) {
    return null;
  }

  const groupIds = [...new Set(members.map(m => m.group_id))];

  const { data: groupsData } = await supabase
    .from(TABLES.RIDER_GROUPS)
    .select('*')
    .in('id', groupIds);

  if (!groupsData) {
    return null;
  }

  const { data: allSignups } = await supabase
    .from(TABLES.SIGNUPS)
    .select('*')
    .in('id', signupIds);

  if (!allSignups) {
    return null;
  }

  const groups: RiderGroupWithRiders[] = [];

  for (const groupData of groupsData) {
    const groupMembers = members.filter(m => m.group_id === groupData.id);
    const riderIds = groupMembers.map(m => m.signup_id);
    const riders = allSignups.filter(s => riderIds.includes(s.id));

    const ridersWithCoords: RiderWithCoords[] = [];
    for (const rider of riders) {
      if (!rider.address) continue;

      try {
        const geocode = await geocodeAddress(rider.address);
        ridersWithCoords.push({
          ...rider,
          latitude: geocode.latitude,
          longitude: geocode.longitude,
          formattedAddress: geocode.formattedAddress,
        });
      } catch (error) {
        console.error('Failed to geocode rider:', error);
      }
    }

    if (ridersWithCoords.length === 0) continue;

    const center = calculateCenter(
      ridersWithCoords.map(r => ({ latitude: r.latitude, longitude: r.longitude }))
    );

    groups.push({
      id: groupData.id,
      voting_date: groupData.voting_date,
      preferred_time: groupData.preferred_time,
      group_name: groupData.group_name || undefined,
      riders: ridersWithCoords,
      centerLat: center.latitude,
      centerLon: center.longitude,
      riderCount: ridersWithCoords.length,
    });
  }

  return groups.length > 0 ? groups : null;
}

function groupByTimeSlot(signups: Signup[]): Record<string, Signup[]> {
  const groups: Record<string, Signup[]> = {};

  for (const signup of signups) {
    const key = signup.voting_date + '|' + signup.preferred_time;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(signup);
  }

  return groups;
}

async function geocodeSignups(signups: Signup[]): Promise<RiderWithCoords[]> {
  const results: RiderWithCoords[] = [];

  for (const signup of signups) {
    if (!signup.address) continue;

    try {
      const geocode = await geocodeAddress(signup.address);
      results.push({
        ...signup,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        formattedAddress: geocode.formattedAddress,
      });
    } catch (error) {
      console.error('Failed to geocode address:', error);
    }
  }

  return results;
}

function clusterRidersByProximity(
  riders: RiderWithCoords[],
  maxDistanceMiles: number
): RiderWithCoords[][] {
  const clusters: RiderWithCoords[][] = [];
  const remainingRiders = [...riders];

  while (remainingRiders.length > 0) {
    const cluster: RiderWithCoords[] = [remainingRiders[0]];
    remainingRiders.shift();

    let foundNewRider = true;
    while (foundNewRider && remainingRiders.length > 0) {
      foundNewRider = false;

      for (let i = remainingRiders.length - 1; i >= 0; i--) {
        const rider = remainingRiders[i];
        const isNearCluster = cluster.some((clusterRider) => {
          const distance = calculateDistance(
            clusterRider.latitude,
            clusterRider.longitude,
            rider.latitude,
            rider.longitude
          );
          return distance <= maxDistanceMiles;
        });

        if (isNearCluster) {
          cluster.push(rider);
          remainingRiders.splice(i, 1);
          foundNewRider = true;
        }
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function generateGroupName(
  riders: RiderWithCoords[],
  votingDate: string,
  preferredTime: string,
  index: number
): string {
  const timeLabel = preferredTime.toLowerCase().replace(' ', '').replace(':', '');
  const dateLabel = votingDate === 'early-voting-date-1' ? 'Early Voting Day 1' :
                     votingDate === 'early-voting-date-2' ? 'Early Voting Day 2' :
                     votingDate === 'election-day' ? 'Election Day' : votingDate;

  const streets = riders
    .map(r => r.formattedAddress?.split(',')[0])
    .filter(Boolean)
    .slice(0, 2);

  if (streets.length > 0) {
    return dateLabel + ' ' + timeLabel + ' - ' + streets.join(' / ') + ' Area';
  }

  return dateLabel + ' ' + timeLabel + ' - Group ' + (index + 1);
}

export async function groupRidersByProximity(
  signups: Signup[],
  maxDistanceMiles: number = 2
): Promise<RiderGroupWithRiders[]> {
  const signupsWithAddresses = signups.filter(
    s => s.address && s.address.trim().length > 0
  );

  if (signupsWithAddresses.length === 0) {
    return [];
  }

  const signupIds = signupsWithAddresses.map(s => s.id);

  const existingGroups = await loadGroupsFromDatabase(signupIds);
  if (existingGroups) {
    return existingGroups;
  }

  const timeSlots = groupByTimeSlot(signupsWithAddresses);
  const allGroups: RiderGroupWithRiders[] = [];

  for (const [timeKey, slotSignups] of Object.entries(timeSlots)) {
    const [votingDate, preferredTime] = timeKey.split('|');
    const ridersWithCoords = await geocodeSignups(slotSignups);
    const clusters = clusterRidersByProximity(ridersWithCoords, maxDistanceMiles);

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const center = calculateCenter(
        cluster.map(r => ({ latitude: r.latitude, longitude: r.longitude }))
      );

      const group: RiderGroupWithRiders = {
        id: crypto.randomUUID(),
        voting_date: votingDate,
        preferred_time: preferredTime,
        group_name: generateGroupName(cluster, votingDate, preferredTime, i),
        riders: cluster,
        centerLat: center.latitude,
        centerLon: center.longitude,
        riderCount: cluster.length,
      };

      allGroups.push(group);
    }
  }

  await saveGroupsToDatabase(allGroups);

  return allGroups;
}

export function filterGroups(
  groups: RiderGroupWithRiders[],
  votingDate?: string,
  preferredTime?: string
): RiderGroupWithRiders[] {
  return groups.filter((group) => {
    if (votingDate && votingDate !== 'all' && group.voting_date !== votingDate) {
      return false;
    }
    if (preferredTime && preferredTime !== 'all' && group.preferred_time !== preferredTime) {
      return false;
    }
    return true;
  });
}

export function getVotingDates(groups: RiderGroupWithRiders[]): string[] {
  const dates = new Set(groups.map((g) => g.voting_date));
  return Array.from(dates).sort();
}

export function getPreferredTimes(groups: RiderGroupWithRiders[]): string[] {
  const times = new Set(groups.map((g) => g.preferred_time));
  return Array.from(times).sort();
}

export function calculatePickupOrder(group: RiderGroupWithRiders): Array<{
  rider: RiderWithCoords;
  order: number;
  distanceFromPrevious: number;
}> {
  if (group.riders.length === 0) return [];
  if (group.riders.length === 1) {
    return [{ rider: group.riders[0], order: 1, distanceFromPrevious: 0 }];
  }

  const remaining = [...group.riders];
  const ordered: Array<{
    rider: RiderWithCoords;
    order: number;
    distanceFromPrevious: number;
  }> = [];

  let current = remaining.reduce((closest, rider) => {
    const distanceToCenter = calculateDistance(
      group.centerLat, group.centerLon,
      rider.latitude, rider.longitude
    );
    const closestDistance = calculateDistance(
      group.centerLat, group.centerLon,
      closest.latitude, closest.longitude
    );
    return distanceToCenter < closestDistance ? rider : closest;
  });

  ordered.push({ rider: current, order: 1, distanceFromPrevious: 0 });
  remaining.splice(remaining.indexOf(current), 1);

  let order = 2;
  while (remaining.length > 0) {
    const nearest = remaining.reduce((closest, rider) => {
      const distanceFromCurrent = calculateDistance(
        current.latitude, current.longitude,
        rider.latitude, rider.longitude
      );
      const closestDistance = calculateDistance(
        current.latitude, current.longitude,
        closest.latitude, closest.longitude
      );
      return distanceFromCurrent < closestDistance ? rider : closest;
    });

    const distance = calculateDistance(
      current.latitude, current.longitude,
      nearest.latitude, nearest.longitude
    );

    ordered.push({ rider: nearest, order: order++, distanceFromPrevious: distance });
    current = nearest;
    remaining.splice(remaining.indexOf(nearest), 1);
  }

  return ordered;
}
