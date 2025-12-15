
import CoursePage from './pages/User/CoursePage/CoursePage'
import TestPage from './pages/User/TestPage/TestPage'
import UserPage from './pages/User/UserPage/UserPage'
import { ADMIN_APPLICATIONS_ROUTE, ADMIN_CHANGE_USER, ADMIN_LISTENERS_ROUTE, ADMIN_PROGRAMS_ROUTE, ADMIN_REGISTRATE_USER, ADMIN_ROUTE, ADMIN_VIEW_PROGRAM, ADMIN_VIEW_TEST, ADMIN_VIEW_VIDEO, ADMIN_VIEW_ЕУЫЕ, AUTH_ROUTE, CHANGE_PROGRAM_ROUTE, COURSE_ROUTE, FINISH_TEST_ROUTE, FORGOT_PASSWORD_ROUTE, MAIN_ROUTE, MAKE_PROGRAM_ROUTE, PRACTICAL_WORK_ROUTE, TEST_ROUTE, USER_ROUTE, VIDEO_ROUTE, LECTION_ROUTE, ADMIN_PRACTICAL_WORKS_ROUTE, STATEMENT_ROUTE, ADMIN_ONE_PRACTICAL_WORKS_ROUTE, ADMIN_VIEW_LECTION, ADMIN_USER_ROUTE, ADMIN_STATEMENT_USER, ADMIN_ADMINISTRATORS_ROUTE, ADMIN_DOCUMENTS_ROUTE, ADMIN_VIEW_PRACTICAL_WORKS_ROUTE, EXPERT_ROUTE, CHAR_PAGE_ROUTE, CHAT_USERS_PAGE_ROUTE, USER_CHAT_ROUTE } from './utils/consts'
import LoginPage from './pages/LoginPage/LoginPage'
import AdminPage from './pages/Admin/AdminPage/AdminPage'
import AdminProgramsPage from './pages/Admin/AdminProgramsPage/AdminProgramsPage'
import MakeProgram from './pages/Admin/MakeProgram/MakeProgram'
import AdminListeners from './pages/Admin/AdminListeners/AdminListeners'
import RegistrateUser from './pages/Admin/RegistrateUser/RegistrateUser'
import ApplicationPage from './pages/Admin/ApplicationPage/ApplicationPage'
import FinishTestPage from './pages/User/FinishTestPage/FinishTestPage'
import VideoPage from './pages/Admin/VideoPage/VideoPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import ViewProgram from './pages/Admin/ViewProgram/ViewProgram'
import ViewTest from './pages/Admin/ViewTest/ViewTest'
import ViewVideo from './pages/Admin/ViewVideo/ViewVideo'
import PracticalWorkPage from './pages/User/PracticalWorkPage/PracticalWorkPage'
import LectionPage from './pages/User/LectionPage/LectionPage'
import AdminPracticalPage from './pages/Admin/AdminPracticalPage/AdminPracticalPage'
import StatementPage from './pages/User/StatementPage/StatementPage'
import AdminOnePracticalPage from './pages/Admin/AdminOnePracticalPage/AdminOnePracticalPage'
import ViewLection from './pages/Admin/ViewLection/ViewLection'
import AdminUserPage from './pages/Admin/AdminUserPage/AdminUserPage'
import AdminStatementPage from './pages/Admin/AdminStatementPage/AdminStatementPage'
import AdministratorsPage from './pages/Admin/AdministratorsPage/AdministratorsPage'
import AdminDocumentsPage from './pages/Admin/AdminDocumentsPage/AdminDocumentsPage'
import ViewPracticalWorkPage from './pages/Admin/ViewPracticalWorkPage/ViewPracticalWorkPage'
import ChatPage from './pages/Admin/ChatPage/ChatPage'
import ChatUsersPage from './pages/Admin/ChatUsersPage/ChatUsersPage'
import UserChatPage from './pages/User/UserChatPage/UserChatPage'


export const authRoutes = [
    {
        path: COURSE_ROUTE,
        Component: <CoursePage/>
    },
    {
        path: TEST_ROUTE,
        Component: <TestPage/>
    },
    {
        path: FINISH_TEST_ROUTE,
        Component: <FinishTestPage/>
    },
    {
        path: USER_ROUTE,
        Component: <UserPage/>
    },
    {
        path: VIDEO_ROUTE,
        Component: <VideoPage/>
    },

    {
        path: PRACTICAL_WORK_ROUTE,
        Component: <PracticalWorkPage/>
    },
    {
        path: STATEMENT_ROUTE,
        Component: <StatementPage/>
    },
    {
        path: USER_CHAT_ROUTE,
        Component: <UserChatPage/>
    }
    
]

export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: <AdminPage/>
    },
    {
        path: ADMIN_PROGRAMS_ROUTE,
        Component: <AdminProgramsPage/>
    },
    {
        path: MAKE_PROGRAM_ROUTE,
        Component: <MakeProgram/>
    },
    {
        path: CHANGE_PROGRAM_ROUTE,
        Component: <MakeProgram/>
    },
    {
        path: ADMIN_LISTENERS_ROUTE,
        Component: <AdminListeners/>
    },
    {
        path: ADMIN_USER_ROUTE,
        Component: <AdminUserPage/>
    },
    {
        path: ADMIN_REGISTRATE_USER,
        Component: <RegistrateUser/>
    },
    {
        path: ADMIN_CHANGE_USER,
        Component: <RegistrateUser/>
    },
    {
        path: ADMIN_APPLICATIONS_ROUTE,
        Component: <ApplicationPage/>
    },
    {
        path: ADMIN_VIEW_PROGRAM,
        Component: <ViewProgram/>
    },
    {
        path: ADMIN_VIEW_PRACTICAL_WORKS_ROUTE,
        Component: <ViewPracticalWorkPage/>
    },
    {
        path: ADMIN_VIEW_TEST,
        Component: <ViewTest/>
    },
    {
        path: ADMIN_VIEW_VIDEO,
        Component: <ViewVideo/>
    },
    {
        path: ADMIN_VIEW_LECTION,
        Component: <ViewLection/>
    },
    {
        path: ADMIN_PRACTICAL_WORKS_ROUTE,
        Component: <AdminPracticalPage/>
    },
    {
        path: ADMIN_ONE_PRACTICAL_WORKS_ROUTE,
        Component: <AdminOnePracticalPage/>
    },
    {
        path: ADMIN_STATEMENT_USER,
        Component: <AdminStatementPage/>
    },
    {
        path: ADMIN_ADMINISTRATORS_ROUTE,
        Component: <AdministratorsPage/>
    },
    {
        path: ADMIN_DOCUMENTS_ROUTE,
        Component: <AdminDocumentsPage/>
    },
    {
        path: CHAR_PAGE_ROUTE,
        Component: <ChatPage/>
    }
    ,
    {
        path: CHAT_USERS_PAGE_ROUTE,
        Component: <ChatUsersPage/>
    }
]

export const publicRoutes = [
    // {
    //     path: MAIN_ROUTE,
    //     Component: <MainPage/>
    // },
    // {
    //     path: EXPERT_ROUTE,
    //     Component: <ExpertPage/>
    // },

    {
        path: AUTH_ROUTE,
        Component: <LoginPage/>
    },

    {
        path: FORGOT_PASSWORD_ROUTE,
        Component: <ForgotPasswordPage/>,
    },
    {
        path: LECTION_ROUTE,
        Component: <LectionPage/>
    },
    
]