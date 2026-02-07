# Ortoni Report Evolution Roadmap

I've implemented several "premium" features to transform the report into a high-powered debugging tool.

### ✅ Completed In This Session
- [x] **Error Similarity Grouping**: Automatically groups failures by error pattern on the dashboard.
- [x] **Deep Linking**: Shareable URLs (`?id=...`) to pin-point specific execution failures.
- [x] **Retry Side-by-Side Comparison**: New "Retries" tab to compare failed and passed attempts of the same test.
- [x] **Command Palette (⌘+K)**: Instant global search for tests and navigation.
- [x] **Power-User Keyboard Shortcuts**: 
    - `J` / `K` to navigate the test list.
    - `Enter` to open a test.
    - `T` to toggle Dark/Light mode.
- [x] **Export Options**: Copy failure summaries for Slack, Jira, or direct link.
- [x] **Console Cleanup**: Fixed unique key warnings and duplicate key errors in charts.

---

### 🚀 Future Roadmap

#### 1. Advanced Debugging & AI Insights
- [x] **AI-Driven Root Cause Analysis**: Integrated "Suggest Fix" button that uses LLMs (OpenAI, Gemini, Claude, Ollama) to explain failures. Users can configure model/key in settings.

#### 2. Data Visualization & Analytics
- **Heatmaps**: A "Test Reliability" heatmap showing which days/times the suite is most flaky.
- **Trace Viewer Overlay**: Embed a "Quick Preview" of the Playwright Trace Viewer or a "Timeline View" of the test steps.

#### 3. Performance & Scalability
- [x] **List Virtualization**: For massive test suites (5,000+ tests), implemented `@tanstack/react-virtual` in the `TestList`.

#### 4. Portability & Integration
- **Custom Branding**: Allow users to inject a custom logo and brand colors via `userConfig`.