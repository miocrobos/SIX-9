# Six Sense

## Overview

Six Sense is an AI-powered "company brain" that turns scattered documents and expert knowledge into living, collaborative **knowledge maps**. Users (and an AI agent) capture concepts, documents, people, decisions, and processes as connected nodes on a shared canvas, so critical organizational knowledge becomes easy to visualize, validate, navigate, and reuse — even after the original expert has left.

The product targets the SIX "Build the Company Brain" challenge: critical knowledge is often tied to individuals and lost when they change roles or leave. Six Sense makes that knowledge transparent, traceable, and governed by mapping its meaning and relationships, with evidence-backed AI that cites its sources.

## Goals

1. Let authenticated employees create and manage knowledge-map projects.
2. Provide a collaborative real-time canvas for building knowledge / meaning maps.
3. Let users import prebuilt knowledge-map templates (onboarding, compliance, decision trails, etc.).
4. Let an AI agent generate an initial knowledge map from a natural-language prompt or an uploaded document.
5. Let colleagues refine and validate the generated map together in real time.
6. Convert the map into a persistent, evidence-based knowledge brief that can be reused and downloaded.

## Core User Flow

1. Employee signs in.
2. Employee creates or selects a knowledge-map project.
3. Employee enters the project workspace.
4. Employee optionally imports a knowledge-map template into the canvas.
5. Employee prompts the AI (or feeds it a document) to generate or extend the knowledge map.
6. AI places concept/document/decision nodes and relationships in the shared canvas.
7. Colleagues edit, validate, and refine the map.
8. Employee triggers knowledge-brief generation.
9. App persists the generated Markdown knowledge brief.
10. Employee reviews or downloads the brief.

## Features

### Authentication and Projects

- Employee sign-in and route protection.
- Project creation, ownership, and collaborator access.
- Project list and workspace navigation.

### Collaborative Canvas

- Shared real-time canvas using Liveblocks and React Flow.
- Live cursors, presence indicators, and node/edge editing.
- An AI participant ("Sense AI") whose cursor is visible as it builds the map live.
- Canvas snapshots persisted to storage.

### Knowledge-Map Templates

- A curated library of prebuilt knowledge-map templates relevant to the organization.
- Users can import a template into the canvas at any point during editing.
- Templates are static canvas snapshots loaded directly into the active room.
- Covers common patterns: onboarding knowledge, compliance/governance, a decision trail, and more.

### AI Knowledge Mapping

- AI generates a knowledge map from a user-supplied prompt (and, later, from uploaded documents).
- Output is structured as canvas nodes (concepts, documents, people, decisions, processes) and labeled relationships, written into the shared room.
- Generation runs as a durable background task.

### Knowledge Brief Generation

- The current knowledge map is converted into a Markdown knowledge brief.
- Briefs are persisted as files and linked to the project in the database.
- Users can view and download generated briefs.

## Related / Adjacent Work

- A separate **PDF / document uploader** is being built and will be combined with this project so maps can be generated directly from source documents.
- Both pieces are intended to later integrate into an existing front-end UI with its own design system, which Six Sense will adapt to.

## Scope

### In Scope

- Authentication and route protection
- Project creation and ownership
- Collaborator access by project
- Knowledge-map template library and import
- Real-time shared canvas with nodes, edges, and presence (including a live AI cursor)
- AI-powered knowledge-map generation from prompts
- AI-powered Markdown knowledge-brief generation from the map
- Persistent storage for project metadata and generated artifacts
- Brief download

### Out Of Scope (for now)

- Billing and subscription systems
- Enterprise permission tiers beyond owner and collaborator
- Versioned brief history and review workflows
- Production object storage migration
- Mobile-native applications
- Final integration into the external front-end (planned, later)

## Success Criteria

1. A signed-in employee can create and open a knowledge-map project.
2. Multiple users can collaborate in the same canvas simultaneously and see each other's cursors.
3. A user can import a prebuilt knowledge-map template into the canvas.
4. AI can generate a knowledge map into the shared room from a prompt, with its cursor visible while it works.
5. The map can be converted into a persisted Markdown knowledge brief.
6. Project metadata and generated artifacts are stored in the correct layers.

## Judging Alignment (SIX challenge)

- **Creativity & Innovation (30%):** Visualizing tribal knowledge as navigable meaning maps built collaboratively with an AI agent.
- **Design (30%):** Clear, real-time, multiplayer UX with a visible AI collaborator.
- **Viability/Feasibility (30%):** Built on durable background tasks, governed access, and evidence-based, traceable output.
- **Presentation (10%):** A clickable prototype that demonstrates capture → contextualize → reuse.
