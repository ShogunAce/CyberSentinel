import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './LandingPage';
import { ActionPlanPage, CoveragePage, NewScanPage, OverviewPage, ReportLayoutPage, ReportsPage, WorkspaceLayout } from './Workspace';
import './styles.css';
function RouteEffects() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); document.title = pathname === '/' ? 'Sentinel — Keep building with clarity' : 'Sentinel — Workspace'; const main = document.querySelector<HTMLElement>('main'); if (main) { main.tabIndex = -1; main.focus({ preventScroll: true }); } }, [pathname]); return null; }
function App() { const [url, setUrl] = useState(''); const form = { value: url, onChange: setUrl }; return <BrowserRouter><a className="skip-link" href="#main-content">Skip to content</a><RouteEffects/><Routes><Route path="/" element={<LandingPage {...form}/>}/><Route path="/workspace" element={<WorkspaceLayout/>}><Route index element={<OverviewPage/>}/><Route path="new-scan" element={<NewScanPage {...form}/>}/><Route path="reports" element={<ReportsPage/>}/><Route path="reports/layout" element={<ReportLayoutPage/>}/><Route path="action-plan" element={<ActionPlanPage/>}/><Route path="coverage" element={<CoveragePage/>}/></Route><Route path="*" element={<main className="not-found" id="main-content"><h1>This page isn’t here.</h1><p>Find a clearer next step in the workspace.</p><Link className="button" to="/">Back to Sentinel</Link></main>}/></Routes></BrowserRouter>; }
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
