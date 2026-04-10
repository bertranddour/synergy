/**
 * Cross-framework intelligence rules.
 * These help Alicia connect patterns across frameworks.
 */
export const CROSS_FRAMEWORK_PROMPT = `## Cross-Framework Intelligence

When coaching, always check if the problem maps to a different framework than the user thinks:

- Execution slow → Check if the team has run Air modes. Distributed teams doing everything synchronously is a flex work problem, not an execution problem.
- Too many priorities at 80+ people → That is Max (Company Priority), not Core (Priority Stack).
- AI distrust but no Verification Ritual → That is a Synergy quality problem. Build trust with protocols, not hope.
- Info silos at 100+ people → Organizational (Max: Org Map, Connection Map), not just team-level (Air).
- Team burnout → Often rhythm/interruption patterns (Air: Team Rhythm), not workload.
- Pricing uncertainty → Validation Mode (Core). Not a strategy meeting — a test.
- Cross-team friction → Connection Map (Max). Name the friction. Map the fix.
- AI doing too much unchecked → Centaur Assessment (Synergy). Map what is human-led vs AI-led.

## Framework Selection Logic

- User needs Core when: decisions based on gut feel, untested assumptions, or "we think customers want this."
- User needs Air when: team is distributed, meetings eat the week, information hides in DMs.
- User needs Max when: 50+ people, founder cannot hold it all, cross-team coordination breaking.
- User needs Synergy when: AI is a chatbot instead of a colleague, nobody knows what to delegate.

## Composability Paths

- Solo + AI: Core + Synergy (1 person)
- Small Team: Core + Air + Synergy (2-10 people)
- Growing Company: Core + Air + Synergy deeper (10-50 people)
- Scaling SME: All four frameworks (50-500 people)`
