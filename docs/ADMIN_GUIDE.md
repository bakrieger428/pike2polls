# Pike2ThePolls Admin Guide

This guide provides comprehensive instructions for admin users accessing and managing the Pike2ThePolls admin dashboard.

## Table of Contents

1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Admin User Requirements](#admin-user-requirements)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Ride Requests](#managing-ride-requests)
5. [Filtering and Searching](#filtering-and-searching)
6. [Exporting Data](#exporting-data)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)
9. [Contact and Support](#contact-and-support)

---

## Accessing the Admin Dashboard

### Login URL

The admin dashboard is accessed at:

```
https://pike2thepolls.com/admin
```

### Login Process

1. Navigate to the admin login page at `/admin/login`
2. Enter your admin email address
3. Enter your password
4. Click the "Sign In" button
5. If authenticated successfully, you will be redirected to the admin dashboard

**Note**: Your email must end with `@pike2thepolls.com` or `@trustee.pike.in.gov` to access the admin dashboard.

### Session Management

- Your session will remain active until you sign out or your browser session expires
- Sessions are automatically refreshed when valid
- Always sign out when you're done, especially on shared devices

---

## Admin User Requirements

### Authorized Email Domains

Admin access is restricted to users with email addresses ending in:

- `@pike2thepolls.com`
- `@trustee.pike.in.gov`

### How Admin Accounts Are Created

Admin accounts must be created in the Supabase dashboard by a system administrator:

1. Log in to the Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter the user's email address (must use an authorized domain)
5. Set a temporary password or send an email invite
6. The user can then log in and change their password

### First-Time Login

When logging in for the first time:

1. Use the temporary password provided by your administrator
2. You will be prompted to create a new password
3. Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers
4. Your password change will take effect immediately

---

## Dashboard Overview

### Main Dashboard Sections

When you log in, you'll see the following sections:

#### 1. Dashboard Header

- **Welcome Message**: Displays your name and email
- **Sign Out Button**: Securely ends your admin session
- **Quick Navigation**: Access to main site and FAQ

#### 2. Statistics Cards

Three cards display key metrics:

- **Total Signups**: Total number of residents who have signed up for rides
- **Pending**: Number of ride requests awaiting confirmation
- **Confirmed**: Number of rides that have been confirmed

#### 3. Signup List

The main section displays all ride signups with:

- **Resident name** (first and last name)
- **Contact information** (email and phone)
- **Voting details** (date and preferred time)
- **Pickup address** (if provided)
- **Status** (pending, confirmed, or cancelled)
- **Action buttons** (confirm, cancel, delete)

---

## Managing Ride Requests

### Viewing Signup Details

Each signup card displays:

1. **Resident Information**
   - Full name
   - Email address
   - Phone number
   - Pickup address (if provided)

2. **Voting Information**
   - Voting date (early voting dates or election day)
   - Preferred time slot (8 AM - 6 PM)
   - Any special notes provided by the resident

3. **Current Status**
   - **Pending**: New signup awaiting review
   - **Confirmed**: Ride has been confirmed
   - **Cancelled**: Ride request has been cancelled

### Changing Signup Status

To update a signup's status:

1. Locate the signup card in the list
2. Click the appropriate action button:
   - **Confirm**: Confirm the ride request
   - **Cancel**: Cancel the ride request
   - **Delete**: Permanently remove the signup

3. Confirm the action when prompted
4. The status will update immediately

**Note**: Deleted signups cannot be recovered. Only use delete for duplicates or erroneous entries.

### Best Practices for Status Management

- **Confirm rides** only after you have verified the request and assigned a driver
- **Cancel rides** if the resident requests it or if the request cannot be fulfilled
- **Delete signups** only for test entries or obvious duplicates
- Keep signups in **Pending** status until you've had a chance to review them

---

## Filtering and Searching

### Filter Options

The dashboard provides several ways to find specific signups:

#### By Status

Filter signups by their current status:

- **All**: Show all signups regardless of status
- **Pending**: Show only pending ride requests
- **Confirmed**: Show only confirmed rides
- **Cancelled**: Show only cancelled rides

#### By Name or Email

Use the search box to find signups by:

- First name
- Last name
- Email address
- Phone number

The search is instant and updates as you type.

### Sorting Options

Sort the signup list by:

- **Newest First**: Most recent signups appear at the top (default)
- **Oldest First**: Earliest signups appear at the top
- **Name (A-Z)**: Alphabetical by last name
- **Voting Date**: Chronological by voting date

### Using Filters Together

You can combine filters and search for precise results:

1. Enter a search term in the search box
2. Select a status filter
3. Choose a sort order

Example: To find all pending signups for residents named "Smith", enter "Smith" in the search box and select "Pending" from the status filter.

---

## Exporting Data

### CSV Export Feature

The dashboard allows you to export all signups to a CSV file for:

- Data backup
- Analysis in spreadsheet software
- Sharing with team members
- Printing physical records

### How to Export

1. Click the **"Export to CSV"** button near the top of the signup list
2. A CSV file will be automatically downloaded to your computer
3. Open the file in Excel, Google Sheets, or any spreadsheet application

### Export File Format

The CSV file includes the following columns:

| Column | Description |
|--------|-------------|
| ID | Unique identifier for the signup |
| Created At | Date and time of signup |
| First Name | Resident's first name |
| Last Name | Resident's last name |
| Email | Email address |
| Phone | Phone number |
| Address | Pickup address (if provided) |
| Voting Date | Early voting date or election day |
| Preferred Time | Selected time slot |
| Status | Current status (pending/confirmed/cancelled) |
| Notes | Any notes provided by resident |

### Excel Compatibility

The exported CSV file includes a UTF-8 BOM (Byte Order Mark) to ensure proper character encoding in Microsoft Excel. All special characters and formatting will display correctly.

---

## Troubleshooting

### Common Issues and Solutions

#### "Access Denied" Error

**Symptoms**: You see an "Access Denied" message after logging in.

**Causes**:
- Your email address is not from an authorized domain
- Your account has not been set up as an admin user

**Solutions**:
1. Verify you're using an email ending in `@pike2thepolls.com` or `@trustee.pike.in.gov`
2. Contact your system administrator to verify your admin account is properly configured
3. Try clearing your browser cache and cookies
4. Try logging in from an incognito/private browser window

#### "Invalid Login Credentials" Error

**Symptoms**: Login attempt fails with invalid credentials message.

**Causes**:
- Incorrect email or password
- Caps lock is enabled
- Typo in email or password

**Solutions**:
1. Double-check your email address for typos
2. Verify your password is correct (check for caps lock)
3. Reset your password through Supabase if needed (contact administrator)

#### Dashboard Shows Placeholder Data

**Symptoms**: Statistics show "--" or the signup list says "Database not yet configured."

**Causes**: The Supabase database has not been fully set up or configured.

**Solutions**:
1. Contact the system administrator
2. Verify the Supabase project is properly configured
3. Ensure the `signups` table exists in the database
4. Check that environment variables are correctly set

#### Signups Not Updating

**Symptoms**: Changes to signup status don't appear to save.

**Causes**:
- Network connectivity issues
- Browser caching problems
- Session expired

**Solutions**:
1. Refresh the page in your browser
2. Check your internet connection
3. Sign out and sign back in
4. Try a different browser

#### Export Not Working

**Symptoms**: Clicking "Export to CSV" doesn't download a file.

**Causes**:
- Browser blocking downloads
- Popup blocker enabled
- No signups to export

**Solutions**:
1. Check your browser's download folder
2. Disable popup blocker for pike2thepolls.com
3. Ensure there are signups in the current list
4. Try a different browser

---

## Security Best Practices

### Protecting Resident Data

As an admin user, you have access to sensitive personal information. Follow these security practices:

1. **Never share** your login credentials with anyone
2. **Always sign out** when you're done, especially on shared computers
3. **Use strong passwords** and change them regularly
4. **Don't download** CSV files to public or shared computers
5. **Delete downloaded files** after you're done with them
6. **Lock your screen** when stepping away from your computer

### Recognizing Phishing Attempts

Be aware of suspicious emails or messages:

- Pike2ThePolls will never ask for your password via email
- Don't click on suspicious links in emails claiming to be from Pike2ThePolls
- Always verify the URL before entering your credentials (it should be pike2thepolls.com/admin)
- Report suspicious activity to your system administrator

### Data Privacy Guidelines

- Access resident data only for legitimate purposes
- Don't share resident information outside the Pike Township Trustee Office
- Use the export feature responsibly and store exported data securely
- Follow all applicable privacy laws and regulations

---

## Contact and Support

### Getting Help

If you encounter issues not covered in this guide:

**Email Support**: trustee@pike2thepolls.com

When contacting support, include:

- Your name and email address
- A description of the problem
- Steps to reproduce the issue (if applicable)
- Screenshots (if helpful)

### System Administrator

For account-related issues:

- Password resets
- New admin account creation
- Permission changes
- Database access issues

Contact your system administrator at: trustee@pike2thepolls.com

### Documentation Updates

This guide is maintained alongside the Pike2ThePolls application. Check for updated versions when the application is updated.

---

## Appendix

### Glossary

- **Signup**: A resident's request for a ride to the polls
- **Status**: The current state of a signup (pending, confirmed, cancelled)
- **Supabase**: The database and authentication service used by Pike2ThePolls
- **Dashboard**: The admin interface for managing signups
- **CSV**: Comma-Separated Values, a file format for spreadsheet data

### Keyboard Shortcuts (Coming Soon)

Future updates may include keyboard shortcuts for common actions. Refer to the onscreen help for the latest shortcuts.

### Related Documentation

- [README.md](../README.md) - Project overview and setup
- [SUPABASE_DEPLOYMENT.md](../SUPABASE_DEPLOYMENT.md) - Database setup instructions
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide

---

**Document Version**: 1.0
**Last Updated**: February 27, 2026
**Maintained By**: Pike2ThePolls Development Team
