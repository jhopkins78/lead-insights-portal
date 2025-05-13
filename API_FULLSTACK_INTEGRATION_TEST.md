# Fullstack Integration Test: Lovable (React/Vite) + FastAPI

## Project Locations
- **Frontend:** `/Users/joshuahopkins/Documents/Retool/lead-insights-portal-main`
- **Backend:** `/Users/joshuahopkins/Documents/Retool/lead_commander_organized/backend`

---

## 1. API Endpoint Connectivity & CORS

| Endpoint                | Method | Test Command (curl)                                                                 | Expected Status | Pass/Fail |
|-------------------------|--------|------------------------------------------------------------------------------------|-----------------|-----------|
| /leads/analyze          | POST   | `curl -X POST http://localhost:8000/leads/analyze -H "Content-Type: application/json" -d '{"name":"Test","title":"CEO","company":"Acme","email":"test@acme.com","intent":"demo"}'` | 200             |           |
| /leads/ltv              | POST   | `curl -X POST http://localhost:8000/leads/ltv -H "Content-Type: application/json" -d '{"deal_amount":10000,"repeat_purchases":2}'` | 200             |           |
| /generate_coaching      | POST   | `curl -X POST http://localhost:8000/generate_coaching -H "Content-Type: application/json" -d '{"lead":"Test","context":"demo"}'` | 200             |           |
| /get_leads              | GET    | `curl http://localhost:8000/get_leads`                                             | 200             |           |
| /report/add_section     | POST   | `curl -X POST http://localhost:8000/report/add_section -H "Content-Type: application/json" -d '{"section":"# Markdown Section"}'` | 200             |           |
| /health                 | GET    | `curl http://localhost:8000/health`                                                | 200             |           |

- **CORS:** Test each endpoint from the frontend (http://localhost:5173) and verify no CORS errors in browser console.

---

## 2. API Contract Comparison

| Endpoint                | Request TypeScript Interface         | Request Pydantic Model         | Response TypeScript Interface         | Response Pydantic Model         | Match? | Notes |
|-------------------------|--------------------------------------|-------------------------------|--------------------------------------|-------------------------------|--------|-------|
| /leads/analyze          | LeadAnalysisRequest                  | LeadAnalysisRequest           | LeadAnalysisResponse                  | LeadAnalysisResponse           |        |       |
| /leads/ltv              | LtvEstimateRequest                   | LtvEstimateRequest            | LtvEstimateResponse                   | LtvEstimateResponse            |        |       |
| /insights/generate      | `{ input: string }`                  | InsightRequest                | InsightResponse                       | InsightResponse                |        |       |
| /report/add_section     | `{ section: string }`                | ReportSectionRequest          | `{ success: boolean }`                | ReportSectionResponse          |        |       |
| /get_leads              | N/A (array of lead objects)          | List[dict]                    | Array of lead objects                 | List[dict]                     |        |       |
| /health                 | N/A                                  | N/A                           | `{ status: "ok" }`                    | `{ status: "ok" }`             |        |       |

- **Check:** For each endpoint, compare keys, types, and nesting. Fill in "Match?" and "Notes" after testing.

---

## 3. .env Consistency

- **Backend:** `.env.example` includes `PORT`, `DB_URI`, `OPENAI_API_KEY`, `SECRET_KEY`, `ALLOWED_ORIGINS`
- **Frontend:** `.env.example` includes `VITE_API_BASE_URL=http://localhost:8000`

---

## 4. Error Handling Tests

For each endpoint, test:
- Missing required fields (should return 422 or 400)
- Malformed JSON (should return 400)
- Large payloads (should return 413 or 500)
- Simulate backend error (e.g., force agent to throw)

Example:
```bash
curl -X POST http://localhost:8000/leads/analyze -H "Content-Type: application/json" -d '{}'
```

---

## 5. Agent Behavior

- Trigger each agent (Lead Analyzer, LTV Estimator, Insight Generator, etc.) via the frontend UI and confirm:
  - Valid responses are returned and displayed
  - UI shows errors for invalid/missing input
  - Edge cases (empty, malformed, large input) are handled gracefully

---

## 6. Pass/Fail Report

| Test Area         | Pass/Fail | Notes/Issues |
|-------------------|-----------|--------------|
| API Connectivity  |           |              |
| CORS              |           |              |
| API Contracts     |           |              |
| .env Consistency  |           |              |
| Error Handling    |           |              |
| Agent Behavior    |           |              |

---

## 7. Suggested Code Updates

- List any mismatched keys, types, or formats found during testing
- Suggest backend or frontend code changes as needed

---

## 8. How to Use This Doc

- Run each curl command and fill in the Pass/Fail columns
- Compare request/response payloads in browser dev tools and backend logs
- Use as a checklist for CI/CD integration
