import pytest
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine

from app.database import async_session_maker, create_db_and_tables, get_async_session
from app.models import Base


@pytest.fixture
async def mock_engine(mocker):
    mock_engine = mocker.AsyncMock(spec=AsyncEngine)
    mock_conn = mocker.AsyncMock()
    mock_conn.run_sync = mocker.AsyncMock()
    mock_context = mocker.AsyncMock()
    mock_context.__aenter__.return_value = mock_conn
    mock_engine.begin.return_value = mock_context
    return mock_engine


@pytest.fixture
async def mock_session(mocker):
    mock_session = mocker.AsyncMock(spec=AsyncSession)
    mock_session.__aenter__.return_value = mock_session
    mock_session.__aexit__.return_value = None
    mock_session_maker = mocker.patch("app.database.async_session_maker")
    mock_session_maker.return_value = mock_session
    return mock_session


@pytest.mark.asyncio
async def test_create_db_and_tables(mock_engine, mocker):
    mocker.patch("app.database.engine", mock_engine)
    await create_db_and_tables()
    mock_engine.begin.assert_called_once()
    mock_conn = mock_engine.begin.return_value.__aenter__.return_value
    mock_conn.run_sync.assert_called_once_with(Base.metadata.create_all)


@pytest.mark.asyncio
async def test_get_async_session(mock_session):
    session_generator = get_async_session()
    session = await session_generator.__anext__()
    assert session == mock_session
    mock_session.__aenter__.assert_called_once()


def test_engine_creation():
    assert isinstance(async_session_maker.kw["expire_on_commit"], bool)


@pytest.mark.asyncio
async def test_session_maker_configuration():
    async with async_session_maker() as session:
        assert isinstance(session, AsyncSession)
