from fastapi import FastAPI

from routers import auth
from routers import checkins

from routers import dashboard
from routers import goals
from routers import habits
from routers import schedules
from routers import onboarding
from routers import journals
from routers import coach
from routers import insights
from routers import future_self
from routers import reports
from routers import memory
from routers import rag
from routers import chat
from routers import timeline
app = FastAPI(
    title="TRIVARNA API"
)

app.include_router(auth.router)
app.include_router(checkins.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(habits.router)
app.include_router(schedules.router)
app.include_router(onboarding.router)
app.include_router(journals.router)
app.include_router(coach.router)
app.include_router(insights.router)
app.include_router(future_self.router)
app.include_router(reports.router)
app.include_router(memory.router)
app.include_router(rag.router)
app.include_router(chat.router)
app.include_router(timeline.router)