import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, Bell, BriefcaseBusiness, CheckCircle2, ChevronRight, CirclePlus, ClipboardList, Edit3, LayoutDashboard, Mail, MoreHorizontal, PanelsTopLeft, Search, Settings2, Trash2, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/layout/index.js'
import useAdminSession from '../../data/useAdminSession.js'
import { adminRequest } from '../../data/adminApi.js'
import { routePaths } from '../../data/routePaths.js'
import { isHomepageProject } from '../../data/shared/homepageProjects.js'
import '../../styles/spoorthi-admin.css'



const navItems = [
  { label: 'Overview', icon: LayoutDashboard, target: 'overview' },
  { label: 'Projects', icon: PanelsTopLeft, target: 'projects' },
  { label: 'Services', icon: BriefcaseBusiness, target: 'services' },
  { label: 'Enquiries', icon: ClipboardList, target: 'enquiries' },
]

function Metric({ label, value, detail, icon: Icon, tone }) {
  return <article className={`admin-metric admin-metric--${tone}`}>
    <div className="admin-metric__icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></div>
    <div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div>
  </article>
}

function dedupeProjects(projects) {
  const seen = new Set()
  return projects.filter((project, index) => {
    const identity = project.id || `legacy-${index}`
    if (seen.has(identity)) return false
    seen.add(identity)
    return true
  })
}

function AdminPage() {
  const { session, checking, error: sessionError, localDevelopment, login, logout } = useAdminSession()
  const isAuthenticated = Boolean(session)
  const [loginError, setLoginError] = useState('')
  const [loginValues, setLoginValues] = useState({ username: '', password: '' })
  const [activeSection, setActiveSection] = useState('overview')
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [uploadField, setUploadField] = useState('coverImage')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [adminSettings, setAdminSettings] = useState({ showDemoNotices: true, compactMode: false, defaultBrand: 'all' })
  const [activeBrand, setActiveBrand] = useState('all')
  const [query, setQuery] = useState('')
  const [projectStatus, setProjectStatus] = useState('all')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [projectFormError, setProjectFormError] = useState('')
  const [projectDraft, setProjectDraft] = useState({ title: '', category: '', brand: 'Spoorthi Infra', area: '', serviceNeeded: '', location: '', description: '', coverImage: '', twoDImage: '', threeDImage: '', finalOutputImage: '', vrArUrl: '', showOnHomepage: false })
  const [projectItems, setProjectItems] = useState([])
  const [serviceItems, setServiceItems] = useState([])
  const [enquiryItems, setEnquiryItems] = useState([])
  const [databaseReady, setDatabaseReady] = useState(false)
  const revision = useRef(0)
  const lastSavedPayload = useRef('')
  const saveQueue = useRef(Promise.resolve())
  const writeBlocked = useRef(false)
  const [databaseStatus, setDatabaseStatus] = useState('Connecting to shared workspace…')
  const [databaseError, setDatabaseError] = useState('')
  const visibleProjects = useMemo(() => projectItems.filter((project) => !project.deleted && (activeBrand === 'all' || project.brand === activeBrand) && (projectStatus === 'all' || (project.status || 'Published') === projectStatus) && (project.title.toLowerCase().includes(query.toLowerCase()) || project.category.toLowerCase().includes(query.toLowerCase()))), [activeBrand, projectItems, projectStatus, query])
  const notifications = useMemo(() => [
    ...enquiryItems.filter((enquiry) => enquiry.status !== 'Replied').map((enquiry) => ({ id: `enquiry-${enquiry.name}`, label: 'Enquiry needs attention', detail: `${enquiry.name} · ${enquiry.status}`, target: 'enquiries' })),
    ...projectItems.filter((project) => !project.deleted && (project.status || 'Published') === 'Draft').map((project) => ({ id: `project-${project.id}`, label: 'Project is still a draft', detail: project.title, target: 'projects' })),
  ].slice(0, 5), [enquiryItems, projectItems])

  useEffect(() => {
    if (!isAuthenticated) return
    const controller = new AbortController()
    writeBlocked.current = false
    adminRequest('database', { signal: controller.signal })
      .then((data) => {
        const settings = { showDemoNotices: true, compactMode: false, defaultBrand: 'all', ...data.settings }
        const projects = dedupeProjects(data.projects)
        revision.current = data.revision
        lastSavedPayload.current = JSON.stringify({ projects, services: data.services, enquiries: data.enquiries, settings })
        setProjectItems(projects)
        setServiceItems(data.services)
        setEnquiryItems(data.enquiries)
        setAdminSettings(settings)
        setActiveBrand(settings.defaultBrand)
        setDatabaseReady(true)
        setDatabaseStatus('Saved to shared workspace')
      })
      .catch(error => {
        if (!controller.signal.aborted) setDatabaseError(error.message)
      })
    return () => controller.abort()
  }, [isAuthenticated])

  useEffect(() => {
    if (!databaseReady || !session) return
    const payload = { projects: projectItems, services: serviceItems, enquiries: enquiryItems, settings: adminSettings }
    const serialized = JSON.stringify(payload)
    if (serialized === lastSavedPayload.current) return
    saveQueue.current = saveQueue.current.then(async () => {
        setDatabaseStatus('Saving changes…')
        if (writeBlocked.current) return
        try {
          const result = await adminRequest('database', { method: 'PUT', csrfToken: session.csrfToken, body: { ...payload, revision: revision.current } })
          revision.current = result.revision
          lastSavedPayload.current = serialized
          setDatabaseStatus('Saved to shared workspace')
        } catch (error) {
          writeBlocked.current = true
          setDatabaseError(`${error.message} Changes have not been confirmed saved.`)
        }
    })
  }, [adminSettings, databaseReady, enquiryItems, projectItems, serviceItems, session])

  useEffect(() => {
    if (!databaseReady || !session) return
    const warnUnsaved = event => {
      const payload = JSON.stringify({ projects: projectItems, services: serviceItems, enquiries: enquiryItems, settings: adminSettings })
      if (payload !== lastSavedPayload.current) { event.preventDefault(); event.returnValue = '' }
    }
    window.addEventListener('beforeunload', warnUnsaved)
    return () => window.removeEventListener('beforeunload', warnUnsaved)
  }, [adminSettings, databaseReady, enquiryItems, projectItems, serviceItems, session])

  useEffect(() => {
    if (!showSettings) return
    requestAnimationFrame(() => document.getElementById('admin-settings')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [showSettings])

  async function handleLogin(event) {
    event.preventDefault()
    setDatabaseReady(false)
    setDatabaseError('')
    try { await login(loginValues); setLoginValues({ username: '', password: '' }); setLoginError('') }
    catch (error) { setLoginError(error.message) }
  }

  async function handleLogout() {
    await saveQueue.current
    if (!writeBlocked.current) await logout()
  }

  function jumpTo(target) {
    setShowSettings(false)
    setActiveSection(target)
    document.getElementById(`admin-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function openSettings() {
    setShowSettings(true)
    setActiveSection('settings')
  }

  function updateSetting(key, value) {
    setAdminSettings((settings) => ({ ...settings, [key]: value }))
    if (key === 'defaultBrand') setActiveBrand(value)
  }

  async function uploadProjectImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) { setProjectFormError('Choose a PNG, JPEG or WebP image smaller than 8 MB.'); return }
    setUploadingImage(true)
    setProjectFormError('')
    try {
      const buffer = new Uint8Array(await file.arrayBuffer())
      let binary = ''
      for (let index = 0; index < buffer.length; index += 0x8000) binary += String.fromCharCode(...buffer.subarray(index, index + 0x8000))
      const result = await adminRequest('upload', { method: 'POST', csrfToken: session.csrfToken, body: { filename: file.name, mime: file.type, data: btoa(binary) } })
      setProjectDraft((draft) => ({ ...draft, [uploadField]: result.path }))
    } catch (error) {
      setProjectFormError(error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  function addProject(event) {
    event.preventDefault()
    const title = projectDraft.title.trim()
    const category = projectDraft.category.trim()
    if (!title || !category) { setProjectFormError('Project title and category are required.'); return }
    if (projectDraft.area.trim() && (!Number.isFinite(Number(projectDraft.area)) || Number(projectDraft.area) <= 0)) { setProjectFormError('Enter a valid area greater than zero.'); return }
    if (editingProjectId) {
      setProjectItems(projectItems.map((project) => project.id === editingProjectId ? { ...project, title, category, brand: projectDraft.brand, area: projectDraft.area.trim(), serviceNeeded: projectDraft.serviceNeeded.trim(), location: projectDraft.location.trim(), description: projectDraft.description.trim(), coverImage: projectDraft.coverImage.trim() || project.coverImage, twoDImage: projectDraft.twoDImage.trim(), threeDImage: projectDraft.threeDImage.trim(), finalOutputImage: projectDraft.finalOutputImage.trim(), vrArUrl: projectDraft.vrArUrl.trim(), showOnHomepage: projectDraft.showOnHomepage } : project))
    } else {
      setProjectItems([{ id: `local-${Date.now()}`, title, category, brand: projectDraft.brand, area: projectDraft.area.trim(), serviceNeeded: projectDraft.serviceNeeded.trim(), location: projectDraft.location.trim(), description: projectDraft.description.trim(), twoDImage: projectDraft.twoDImage.trim(), threeDImage: projectDraft.threeDImage.trim(), finalOutputImage: projectDraft.finalOutputImage.trim(), vrArUrl: projectDraft.vrArUrl.trim(), showOnHomepage: projectDraft.showOnHomepage, status: 'Draft', coverImage: projectDraft.coverImage.trim() || (projectDraft.brand === 'Tejes Interiors' ? '/assets/tejes/services/hero-1024.webp' : '/assets/spoorthi/architecture.webp') }, ...projectItems])
    }
    setProjectDraft({ title: '', category: '', brand: 'Spoorthi Infra', area: '', serviceNeeded: '', location: '', description: '', coverImage: '', twoDImage: '', threeDImage: '', finalOutputImage: '', vrArUrl: '', showOnHomepage: false })
    setEditingProjectId(null)
    setProjectFormError('')
    setShowProjectForm(false)
  }

  function editProject(project) {
    setProjectDraft({ title: project.title, category: project.category, brand: project.brand, area: project.area || '', serviceNeeded: project.serviceNeeded || '', location: project.location || '', description: project.description || '', coverImage: project.coverImage || '', twoDImage: project.twoDImage ?? project.twoDImages?.[0]?.image.src ?? '', threeDImage: project.threeDImage ?? project.threeDImages?.[0]?.image.src ?? '', finalOutputImage: project.finalOutputImage ?? project.visualizationImages?.[0]?.image.src ?? '', vrArUrl: project.vrArUrl || '', showOnHomepage: isHomepageProject(project) })
    setEditingProjectId(project.id)
    setProjectFormError('')
    setShowProjectForm(true)
  }

  function requestProjectDelete(project) { setDeleteCandidate(project) }
  function removeProject() {
    if (!deleteCandidate) return
    setProjectItems(projectItems.flatMap(project => project.id !== deleteCandidate.id ? [project] : project.isConcept ? [{ ...project, deleted: true, status: 'Draft' }] : []))
    setDeleteCandidate(null)
  }
  function toggleProjectStatus(id) { setProjectItems(projectItems.map((project) => project.id === id ? { ...project, status: (project.status || 'Published') === 'Published' ? 'Draft' : 'Published' } : project)) }
  function toggleService(name) { setServiceItems(serviceItems.map((service) => service.name === name ? { ...service, status: service.status === 'Published' ? 'Draft' : 'Published' } : service)) }
  function cycleEnquiryStatus(name) { const statuses = ['New', 'In review', 'Replied']; setEnquiryItems(enquiryItems.map((enquiry) => { if (enquiry.name !== name) return enquiry; const next = statuses[(statuses.indexOf(enquiry.status) + 1) % statuses.length]; return { ...enquiry, status: next } })) }

  if (checking) return <div className="spoorthi-admin"><PageContainer><p role="status">Checking administrator session…</p></PageContainer></div>

  if (isAuthenticated && (!databaseReady || databaseError)) return <div className="spoorthi-admin"><PageContainer><section className="admin-login__form"><h1>Shared workspace</h1><p role={databaseError ? 'alert' : 'status'}>{databaseError || 'Loading saved workspace…'}</p>{databaseError && <><button type="button" className="admin-primary-button" onClick={() => window.location.reload()}>Reload saved workspace</button><p>Unsaved changes, if any, are shown below so you can keep a copy before reloading.</p><textarea readOnly aria-label="Unsaved workspace recovery copy" rows={8} value={JSON.stringify({ projects: projectItems, services: serviceItems, enquiries: enquiryItems, settings: adminSettings }, null, 2)} /></>}<button type="button" className="admin-secondary-button" onClick={handleLogout}>Sign out</button></section></PageContainer></div>


  if (!isAuthenticated) return <div className="spoorthi-admin"><PageContainer><div className="admin-login"><div className="admin-login__art"><span className="admin-sidebar__mark">SI</span><p className="admin-kicker">Spoorthi Infra × Tejes Interiors</p><h1>One workspace.<br /><em>Two practices.</em></h1><p>Review projects, services, and enquiries from one clear admin dashboard.</p><div className="admin-login__art-grid"><span /><span /><span /><span /></div></div><form className="admin-login__form" onSubmit={handleLogin}><div><p className="admin-kicker">Workspace access</p><h2>Sign in to admin</h2><p className="admin-login__muted">{localDevelopment ? 'Enter your administrator username for local development.' : 'Sign in with the administrator credentials configured on the server.'}</p></div><label>Username<input autoComplete="username" value={loginValues.username} onChange={(event) => setLoginValues({ ...loginValues, username: event.target.value })} placeholder="Enter username" /></label>{!localDevelopment && <label>Password<input autoComplete="current-password" type="password" value={loginValues.password} onChange={(event) => setLoginValues({ ...loginValues, password: event.target.value })} placeholder="Enter password" /></label>}{(loginError || sessionError) && <p className="admin-login__error" role="alert">{loginError || sessionError}</p>}<button className="admin-primary-button" type="submit">Continue to dashboard <ChevronRight size={16} aria-hidden="true" /></button><Link to={routePaths.spoorthi.home} className="admin-login__back">← Return to website</Link></form></div></PageContainer></div>

  return <div className="spoorthi-admin">
    <PageContainer>
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin dashboard navigation">
          <div className="admin-sidebar__brand"><span className="admin-sidebar__mark">SI</span><div><strong>Spoorthi Infra</strong><span>Admin workspace</span></div></div>
          <div className="admin-sidebar__label">Workspace</div>
          <nav className="admin-sidebar__nav">
            {navItems.map(({ label, icon: Icon, target }) => <button type="button" className={activeSection === target ? 'is-active' : ''} key={target} onClick={() => jumpTo(target)}><Icon size={17} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span>{target === 'enquiries' && <b>{enquiryItems.filter(item => item.status !== 'Replied').length}</b>}</button>)}
          </nav>
          <div className="admin-sidebar__footer"><button type="button" onClick={openSettings} aria-expanded={showSettings}><Settings2 size={17} aria-hidden="true" />Settings</button><button type="button" onClick={logout}>Sign out</button><Link to={routePaths.spoorthi.home}><ChevronRight size={17} aria-hidden="true" />View website</Link></div>
        </aside>

        <main className={`admin-main ${adminSettings.compactMode ? 'admin-main--compact' : ''}`} id="admin-overview">
          <header className="admin-topbar"><div className="admin-topbar__identity"><span className="admin-sidebar__mark">SI</span><div><p className="admin-kicker">Overall website workspace</p><h1>Workspace overview</h1><p className="admin-intro">A single view across Spoorthi Infra and Tejes Interiors.</p></div></div><div className="admin-topbar__actions"><div className="admin-notification-wrap"><button type="button" className="admin-icon-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} aria-hidden="true" />{notifications.length > 0 && <span />}</button>{showNotifications && <div className="admin-notification-panel" role="dialog" aria-label="Workspace activity"><div className="admin-notification-panel__head"><div><p className="admin-kicker">Workspace activity</p><h2>Notifications</h2></div><button type="button" className="admin-notification-panel__close" onClick={() => setShowNotifications(false)} aria-label="Close notifications">×</button></div>{notifications.length ? <div className="admin-notification-list">{notifications.map((notification) => <button type="button" className="admin-notification-item" key={notification.id} onClick={() => { setShowNotifications(false); jumpTo(notification.target) }}><strong>{notification.label}</strong><span>{notification.detail}</span></button>)}</div> : <p className="admin-notification-empty">No new workspace activity.</p>}<p className="admin-notification-panel__note">Activity is derived from saved workspace records.</p></div>}</div><div className="admin-avatar">SS</div></div></header>

          {sessionError && <p role="alert">{sessionError}</p>}
          <p className="admin-save-status" role="status" aria-live="polite">{databaseStatus}</p>
          {adminSettings.showDemoNotices && <div className="admin-preview-note"><span><CheckCircle2 size={17} aria-hidden="true" /></span><p><strong>{databaseStatus}</strong> This overall workspace covers both brands. Project records and images are stored on the shared server. Save failures are shown explicitly.</p></div>}

          <div className="admin-brand-switcher" role="group" aria-label="Filter dashboard by brand"><span>View workspace</span>{['all', 'Spoorthi Infra', 'Tejes Interiors'].map((brand) => <button type="button" className={activeBrand === brand ? 'is-active' : ''} key={brand} onClick={() => setActiveBrand(brand)}>{brand === 'all' ? 'All brands' : brand}</button>)}</div>

          {showSettings && <section className="admin-settings-panel" id="admin-settings" aria-labelledby="admin-settings-title"><div><p className="admin-kicker">Workspace preferences</p><h2 id="admin-settings-title">Settings</h2><p>Preferences are saved to the shared administrator workspace.</p></div><button type="button" className="admin-secondary-button" onClick={() => setShowSettings(false)}>Close settings</button><div className="admin-settings-panel__options"><label><input type="checkbox" checked={adminSettings.showDemoNotices} onChange={(event) => updateSetting('showDemoNotices', event.target.checked)} /> Show workspace storage information</label><label><input type="checkbox" checked={adminSettings.compactMode} onChange={(event) => updateSetting('compactMode', event.target.checked)} /> Use compact project rows</label><label>Default workspace<select value={adminSettings.defaultBrand} onChange={(event) => updateSetting('defaultBrand', event.target.value)}><option value="all">All brands</option><option value="Spoorthi Infra">Spoorthi Infra</option><option value="Tejes Interiors">Tejes Interiors</option></select></label></div><p className="admin-settings-panel__note">Access is checked by the server. Sessions expire after eight hours.</p></section>}

          <section className="admin-metrics" aria-label="Workspace summary">
            <Metric label="Active projects" value={String(projectItems.filter(project => !project.deleted).length).padStart(2, '0')} detail="Saved in project data" icon={PanelsTopLeft} tone="green" />
            <Metric label="Open enquiries" value={String(enquiryItems.filter((enquiry) => enquiry.status !== 'Replied').length).padStart(2, '0')} detail="Click a status to update" icon={Mail} tone="blue" />
            <Metric label="Published services" value={String(serviceItems.filter((service) => service.status === 'Published').length).padStart(2, '0')} detail="Click status to toggle" icon={BriefcaseBusiness} tone="sand" />
            <Metric label="Profile views" value="—" detail="Analytics not connected" icon={BarChart3} tone="lavender" />
          </section>

          <section className="admin-section" id="admin-projects" aria-labelledby="admin-projects-title">
            <div className="admin-section__head"><div><p className="admin-kicker">Content library</p><h2 id="admin-projects-title">Projects</h2></div><button className="admin-primary-button" type="button" onClick={() => { setShowProjectForm(!showProjectForm); setEditingProjectId(null); setProjectFormError(''); setProjectDraft({ title: '', category: '', brand: 'Spoorthi Infra', area: '', serviceNeeded: '', location: '', description: '', coverImage: '', twoDImage: '', threeDImage: '', finalOutputImage: '', vrArUrl: '', showOnHomepage: false }) }}><CirclePlus size={16} aria-hidden="true" />{showProjectForm ? 'Close form' : 'Add project'}</button></div>
            {showProjectForm && <form className="admin-project-form" onSubmit={addProject}><label>Project title<input value={projectDraft.title} onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })} placeholder="e.g. Courtyard residence" required /></label><label>Category<input value={projectDraft.category} onChange={(event) => setProjectDraft({ ...projectDraft, category: event.target.value })} placeholder="e.g. Residential" required /></label><label>Service needed<select value={projectDraft.serviceNeeded} onChange={(event) => setProjectDraft({ ...projectDraft, serviceNeeded: event.target.value })}><option value="">Select a service</option><option>Civil construction</option><option>Architecture & planning</option><option>3D & spatial experiences</option><option>Interior design</option></select></label><label>Approx. area (sq.ft)<input type="number" min="0.01" step="0.01" value={projectDraft.area} onChange={(event) => setProjectDraft({ ...projectDraft, area: event.target.value })} placeholder="e.g. 1800" /></label><label>Location<input value={projectDraft.location} onChange={(event) => setProjectDraft({ ...projectDraft, location: event.target.value })} placeholder="e.g. Hyderabad" /></label><label>Brand<select value={projectDraft.brand} onChange={(event) => setProjectDraft({ ...projectDraft, brand: event.target.value })}><option>Spoorthi Infra</option><option>Tejes Interiors</option></select></label><label className="admin-project-form__homepage"><input type="checkbox" checked={projectDraft.showOnHomepage} onChange={event => setProjectDraft({ ...projectDraft, showOnHomepage: event.target.checked })} /><span>Show on homepage<small>Appears on this brand’s desktop and mobile homepage when published.</small></span></label><label className="admin-project-form__image">Cover image path or URL<input value={projectDraft.coverImage} onChange={(event) => setProjectDraft({ ...projectDraft, coverImage: event.target.value })} placeholder="/assets/spoorthi/architecture.webp or https://…" /><span>Leave blank to use the brand fallback image.</span>{(projectDraft.coverImage || (editingProjectId && projectItems.find((project) => project.id === editingProjectId)?.coverImage)) && <img src={projectDraft.coverImage || projectItems.find((project) => project.id === editingProjectId)?.coverImage} alt="Cover preview" />}</label><div className="admin-project-form__media"><p className="admin-project-form__media-title">Project media layers</p><label>2D drawing path or URL<input value={projectDraft.twoDImage} onChange={(event) => setProjectDraft({ ...projectDraft, twoDImage: event.target.value })} placeholder="Plans, elevations, or drawings" /></label><label>3D structure path or URL<input value={projectDraft.threeDImage} onChange={(event) => setProjectDraft({ ...projectDraft, threeDImage: event.target.value })} placeholder="Model or visualization" /></label><label>Final output path or URL<input value={projectDraft.finalOutputImage} onChange={(event) => setProjectDraft({ ...projectDraft, finalOutputImage: event.target.value })} placeholder="Completed result" /></label><label>VR / AR video URL<input value={projectDraft.vrArUrl} onChange={(event) => setProjectDraft({ ...projectDraft, vrArUrl: event.target.value })} placeholder="https://…" /></label></div><div className="admin-project-form__upload"><label>Upload from laptop<select value={uploadField} onChange={(event) => setUploadField(event.target.value)}><option value="coverImage">Cover image</option><option value="twoDImage">2D drawing</option><option value="threeDImage">3D structure</option><option value="finalOutputImage">Final output</option></select></label><label className="admin-project-form__file">{uploadingImage ? 'Saving image…' : 'Choose image file'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadProjectImage} disabled={uploadingImage} /></label><p>PNG, JPEG or WebP, up to 8 MB. Images are saved to persistent server storage.</p></div><label className="admin-project-form__description">Project brief<textarea value={projectDraft.description} onChange={(event) => setProjectDraft({ ...projectDraft, description: event.target.value })} placeholder="Describe the project scope, priorities, or client brief" rows="3" /></label><button className="admin-primary-button" type="submit">{editingProjectId ? 'Update project' : 'Save project'}</button>{projectFormError && <p className="admin-project-form__error" role="alert">{projectFormError}</p>}</form>}
            <div className="admin-toolbar"><label className="admin-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></label><label className="admin-filter"><span className="sr-only">Filter projects by status</span><select value={projectStatus} onChange={(event) => setProjectStatus(event.target.value)}><option value="all">All statuses</option><option value="Published">Published</option><option value="Draft">Draft</option></select></label></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Project</th><th>Brand / type</th><th>Status</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleProjects.map((project, index) => { const status = project.status || 'Published'; return <tr key={project.id}><td><div className="admin-project-cell"><img src={project.coverImage} alt="" /><div><strong>{project.title}</strong><span>{project.id.replaceAll('-', ' ')}</span></div></div></td><td>{project.brand}<br /><small>{project.category}</small></td><td><button type="button" className={`admin-status ${status === 'Draft' ? 'admin-status--draft' : 'admin-status--published'}`} onClick={() => toggleProjectStatus(project.id)} aria-label={`Set ${project.title} ${status === 'Draft' ? 'published' : 'draft'}`}>{status}</button></td><td>{index === 0 ? 'Today' : `${index + 1} days ago`}</td><td className="admin-table__actions"><button type="button" className="admin-more" onClick={() => editProject(project)} aria-label={`Edit ${project.title}`}><Edit3 size={16} aria-hidden="true" /></button><button type="button" className="admin-more admin-more--danger" onClick={() => requestProjectDelete(project)} aria-label={`Delete ${project.title}`}><Trash2 size={16} aria-hidden="true" /></button></td></tr> })}</tbody></table>{visibleProjects.length === 0 && <p className="admin-empty">No projects match your search.</p>}</div>
          </section>

          <div className="admin-content-grid">
            <section className="admin-section admin-section--compact" id="admin-services" aria-labelledby="admin-services-title"><div className="admin-section__head"><div><p className="admin-kicker">Offerings</p><h2 id="admin-services-title">Services</h2></div><button type="button" className="admin-link-button" onClick={() => jumpTo('services')}>Manage all <ChevronRight size={15} aria-hidden="true" /></button></div><div className="admin-service-list">{serviceItems.map((service) => <article className="admin-service-row" key={service.name}><span className={`admin-service-row__icon admin-service-row__icon--${service.color}`}><BriefcaseBusiness size={16} aria-hidden="true" /></span><div><strong>{service.name}</strong><span>{service.type} · {service.enquiries} enquiries</span></div><button type="button" className={`admin-status ${service.status === 'Draft' ? 'admin-status--draft' : 'admin-status--published'}`} onClick={() => toggleService(service.name)}>{service.status}</button><button type="button" className="admin-more" aria-label={`Toggle ${service.name} status`} onClick={() => toggleService(service.name)}><MoreHorizontal size={18} aria-hidden="true" /></button></article>)}</div></section>

            <section className="admin-section admin-section--compact" id="admin-enquiries" aria-labelledby="admin-enquiries-title"><div className="admin-section__head"><div><p className="admin-kicker">Inbox preview</p><h2 id="admin-enquiries-title">Recent enquiries</h2></div><button type="button" className="admin-link-button" onClick={() => jumpTo('enquiries')}>View inbox <ChevronRight size={15} aria-hidden="true" /></button></div><div className="admin-enquiry-list">{enquiryItems.map((enquiry) => <article className="admin-enquiry" key={enquiry.name}><span className="admin-enquiry__avatar">{enquiry.initials}</span><div><strong>{enquiry.name}</strong><span>{enquiry.subject}</span><small>{enquiry.date}</small></div><button type="button" className={`admin-status admin-status--${enquiry.status === 'New' ? 'new' : enquiry.status === 'In review' ? 'review' : 'replied'}`} onClick={() => cycleEnquiryStatus(enquiry.name)}>{enquiry.status}</button></article>)}</div></section>
          </div>

          <section className="admin-quick-actions" aria-label="Quick actions"><div><UsersRound size={22} aria-hidden="true" /><div><strong>Keep the workspace moving</strong><span>Review new enquiries, refresh the project library, or prepare your next service story.</span></div></div><div className="admin-quick-actions__actions"><button type="button" className="admin-secondary-button" onClick={() => jumpTo('enquiries')}>Review enquiries</button><button type="button" className="admin-primary-button" onClick={() => jumpTo('projects')}>Open project library</button><Link className="admin-secondary-button" to={routePaths.spoorthi.projects}>View public library</Link></div></section>
          {deleteCandidate && <div className="admin-confirm-backdrop" role="presentation"><section className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-project-title"><p className="admin-kicker">Remove project</p><h2 id="delete-project-title">Delete “{deleteCandidate.title}”?</h2><p>This removes the record from the shared workspace. The project will be hidden from public views. Uploaded image files are retained.</p><div><button type="button" className="admin-secondary-button" onClick={() => setDeleteCandidate(null)}>Cancel</button><button type="button" className="admin-danger-button" onClick={removeProject}>Delete project</button></div></section></div>}
        </main>
      </div>
    </PageContainer>
  </div>
}

export default AdminPage
