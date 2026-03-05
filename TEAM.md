# Pike2ThePolls Agent Team Configuration

This document describes the specialized agent team structure for the Pike2ThePolls project. Each agent has independent context to prevent context window compression.

## Team Overview

**Team Name**: `pike2polls-team`
**Team Lead**: Orchestrator (User)
**Purpose**: Build Pike2ThePolls web application using specialized agents with isolated contexts

## Agent Roster

### 1. Frontend Developer Agent
**Agent Name**: `frontend-dev`
**Agent Type**: `general-purpose`
**Specialization**: React/Next.js implementation

**Responsibilities**:
- Set up Next.js project with TypeScript
- Implement all 4 pages (Welcome, Signup, FAQ, Admin)
- Build conversational multi-step form component
- Create reusable UI components (Button, Input, Card, Alert)
- Implement form state management
- Build admin dashboard components
- Handle client-side navigation and routing

**Key Files**:
- `src/app/` - All pages
- `src/components/form/` - Multi-step form components
- `src/components/ui/` - Reusable UI primitives
- `src/components/layout/` - Header, Footer, Navigation

---

### 2. Database Engineer Agent
**Agent Name**: `database-engineer`
**Agent Type**: `general-purpose`
**Specialization**: Supabase setup and database architecture

**Responsibilities**:
- Set up Supabase project
- Design and create database schema (`signups` table)
- Configure Row-Level Security (RLS) policies
- Set up Supabase Auth for admin users
- Create Supabase client configuration
- Implement database queries and mutations
- Set up environment variables
- Test database operations

**Key Files**:
- `src/lib/supabase.ts` - Supabase client
- Supabase dashboard configuration
- `.env.local` - Environment variables

---

### 3. UI/UX Designer Agent
**Agent Name**: `ui-designer`
**Agent Type**: `general-purpose`
**Specialization**: Modern UI design and conversational form UX

**Responsibilities**:
- Design modern, attractive UI layout
- Create conversational form flow UX
- Design progress indicators
- Create responsive layout (mobile-first)
- Design visual hierarchy and spacing
- Select color scheme with accessibility in mind
- Design micro-interactions and transitions
- Create mockups or design system documentation

**Key Files**:
- `tailwind.config.js` - Design tokens
- `src/app/globals.css` - Global styles
- Design decisions documentation

---

### 4. Security & Accessibility Reviewer Agent
**Agent Name**: `security-accessibility-reviewer`
**Agent Type**: `security-auditor` (security) + `general-purpose` (accessibility)
**Specialization**: Security and WCAG compliance (NON-NEGOTIABLE)

**Responsibilities**:

**Security**:
- Review all code for security vulnerabilities
- Validate input sanitization
- Verify RLS policies are correctly configured
- Ensure admin authentication is secure
- Check for XSS, CSRF vulnerabilities
- Validate environment variable handling
- Review Supabase security configuration

**Accessibility (WCAG 2.1 AA)**:
- Review all components for accessibility compliance
- Validate semantic HTML usage
- Ensure proper ARIA labels and roles
- Test keyboard navigation
- Validate screen reader compatibility
- Check color contrast ratios
- Ensure focus management
- Test with screen readers (NVDA/JAWS)
- Validate touch target sizes

**Review Process**:
- Review each PR/feature before completion
- Provide detailed feedback on violations
- Verify fixes are properly implemented
- Sign off on accessibility and security compliance

**Critical**: NO code merges without this agent's approval

---

### 5. DevOps Engineer Agent
**Agent Name**: `devops-engineer`
**Agent Type**: `general-purpose`
**Specialization**: Vercel deployment and configuration

**Responsibilities**:
- Set up Vercel project
- Configure custom domain (pike2thepolls.com)
- Set up environment variables in Vercel
- Configure SSL/HTTPS (automatic via Vercel)
- Set up branch preview deployments
- Configure production deployment pipeline
- Test deployment in staging
- Handle DNS configuration
- Set up monitoring/error tracking

**Key Files**:
- `vercel.json` - Vercel configuration
- Vercel dashboard settings
- DNS configuration

---

### 6. Documentation Specialist Agent
**Agent Name**: `documentation-specialist`
**Agent Type**: `docs-writer`
**Specialization**: Code documentation and CLAUDE.md maintenance

**Responsibilities**:
- Maintain CLAUDE.md as project evolves
- Document component APIs and usage
- Create README.md with setup instructions
- Document deployment procedures
- Maintain inline code documentation
- Create admin user guide
- Document accessibility features
- Keep architecture documentation current

**Key Files**:
- `CLAUDE.md` - Project guidance for Claude Code
- `README.md` - Project overview
- `MEMORY.md` - Progress tracking and context
- `docs/` - Additional documentation

---

## Agent Communication Protocol

Agents communicate through **files, not conversation** to prevent context bloat:

```
Agent A completes task → Updates code/files → Notifies Orchestrator
                                    ↓
Orchestrator reviews → Assigns next task to Agent B (with context)
                                    ↓
Agent B reads files → Continues work → Updates code/files
```

## Context Management Rules

1. **Each agent has independent context** - No shared conversation history
2. **Orchestrator maintains project state** - Not individual agents
3. **Code is source of truth** - Agents read from files, not long conversations
4. **Task-based handoffs** - Clear task boundaries prevent context bloat
5. **Agents go idle after tasks** - Don't carry full history between tasks

## Quality Gates

### Non-Negotiable Approvals

1. **Accessibility Reviewer Approval**
   - Every page must pass WCAG 2.1 AA
   - Form must be fully keyboard navigable
   - Screen reader tested and working
   - Color contrast validated
   - NO deployment without this approval

2. **Security Reviewer Approval**
   - All inputs validated and sanitized
   - RLS policies correctly configured
   - Auth flow secure
   - No secrets in code
   - NO deployment without this approval

3. **Orchestrator Final Approval**
   - All tasks completed
   - All reviewers approved
   - Documentation complete
   - Ready for production

## Phases of Work

### Phase 1: Project Foundation (Parallel)
- Frontend Dev: Initialize Next.js with TypeScript, Tailwind
- DevOps Engineer: Set up Vercel project, domain config
- Database Engineer: Set up Supabase project, get credentials
- UI Designer: Create design system, color palette
- Documentation: Create initial README.md

### Phase 2: Database & Authentication (Sequential)
- Database Engineer: Create schema, RLS policies, Auth setup
- Security/Accessibility Reviewer: Review RLS policies, Auth configuration

### Phase 3: UI Components & Pages (Parallel)
- UI Designer: Finalize component designs
- Frontend Dev: Build Welcome page, FAQ page, layout components

### Phase 4: Conversational Form (Sequential)
- Frontend Dev: Build multi-step form with all branches
- Security/Accessibility Reviewer: Full accessibility audit
- Database Engineer: Integrate form with Supabase

### Phase 5: Admin Dashboard (Sequential)
- Database Engineer: Ensure admin auth is properly configured
- Frontend Dev: Build admin dashboard with auth
- Security/Accessibility Reviewer: Review auth flow, RLS policies

### Phase 6: Polish & Documentation (Parallel)
- Frontend Dev: Responsive testing, bug fixes
- Documentation: Complete CLAUDE.md, admin guide
- Security/Accessibility Reviewer: Final full accessibility audit

### Phase 7: Deployment (Sequential)
- DevOps Engineer: Deploy to staging
- All agents: Test staging deployment
- Security/Accessibility Reviewer: Final security/accessibility sign-off
- DevOps Engineer: Deploy to production

## Reference

For detailed implementation plan, see: `C:\Users\pkf428\.claude\plans\linear-sleeping-manatee.md`
