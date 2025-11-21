
import { Lesson, ModuleType, RAGChunk } from "./types";

// Structured Knowledge Base for RAG Simulation
// Breaking the monolith into accessible "Stocks" of information
export const RAG_KNOWLEDGE_BASE: RAGChunk[] = [
  {
    id: 'sys-dyn-core',
    tags: ['system', 'dynamics', 'stocks', 'flows', 'loops', 'feedback'],
    content: `[System Dynamics Core]
- Stocks: Accumulations (Memory, Database, Variables).
- Flows: Changes over time (Functions, API calls, I/O).
- Feedback Loops: The transmission of information about the stock back to the flow.
- Balancing Loop (B-Loop): Goal-seeking stability (e.g., Thermostat, Retry Logic).
- Reinforcing Loop (R-Loop): Compounding growth/decay (e.g., Viral effects, Infinite Recursion).`
  },
  {
    id: 'sys-arch',
    tags: ['archetypes', 'meadows', 'leverage', 'limits'],
    content: `[System Archetypes & Leverage]
- Limits to Growth: An R-Loop hits a resource constraint (B-Loop).
- Shifting the Burden: Solving symptoms instead of root causes.
- Meadows Leverage Points: Constants (L12) are weak. Structure (L3) and Paradigm (L1) are strong.
- Delays: The time between action and result. Major source of system oscillation.`
  },
  {
    id: 'py-basics',
    tags: ['python', 'variables', 'syntax', 'loops', 'control'],
    content: `[Python Foundation]
- Variables are Stocks.
- Functions are Flows.
- While/For loops are Control Structures.
- Recursion is a Reinforcing Loop.
- 'break' statements act as B-Loop terminators.`
  },
  {
    id: 'prompt-eng',
    tags: ['prompt', 'cot', 'rag', 'few-shot', 'chain', 'thought'],
    content: `[Prompt Engineering Strategies]
- Zero-Shot: Direct instruction.
- Few-Shot: Providing examples (Analogous to training data).
- Chain of Thought (CoT): Forcing the model to output reasoning steps (System 2 thinking).
- RAG: Injecting non-parametric knowledge (Context) into the prompt.`
  },
  {
    id: 'biz-ai',
    tags: ['business', 'genai', 'divide', 'roi', 'nanda', 'agentic'],
    content: `[AI in Business 2025]
- GenAI Divide: 5% success rate requires structural change, not just tools.
- Shadow AI: Unofficial usage outpaces governance.
- Agentic Web: Transition from UI-based apps to Intent-based agents.`
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  { id: '1', title: 'Python Basics: Variables & Flows', module: ModuleType.PYTHON, description: 'Understanding Python variables as System Stocks.', isCompleted: true },
  { id: '2', title: 'Control Structures & Feedback', module: ModuleType.PYTHON, description: 'Loops and conditionals as Balancing Loops.', isCompleted: false },
  { id: '3', title: 'Prompt Engineering 101', module: ModuleType.PROMPT_ENG, description: 'Zero-shot vs Few-shot prompting techniques.', isCompleted: false },
  { id: '4', title: 'Advanced Context: RAG', module: ModuleType.PROMPT_ENG, description: 'Using external knowledge to ground LLMs.', isCompleted: false },
];
