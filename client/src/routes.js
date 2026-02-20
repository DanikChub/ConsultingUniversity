
import CoursePage from './pages/User/CoursePage/CoursePage'
import TestPage from './pages/User/TestPage/TestPage'
import UserPage from './pages/User/UserPage/UserPage'
import {
    ADMIN_APPLICATIONS_ROUTE,
    ADMIN_CHANGE_USER,
    ADMIN_LISTENERS_ROUTE,
    ADMIN_PROGRAMS_ROUTE,
    ADMIN_REGISTRATE_USER,
    ADMIN_ROUTE,
    ADMIN_VIEW_PROGRAM,
    ADMIN_VIEW_TEST,
    ADMIN_VIEW_VIDEO,
    ADMIN_VIEW_ЕУЫЕ,
    AUTH_ROUTE,
    COURSE_ROUTE,
    FINISH_TEST_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    MAIN_ROUTE,
    MAKE_PROGRAM_ROUTE,
    PRACTICAL_WORK_ROUTE,
    TEST_ROUTE,
    USER_ROUTE,
    VIDEO_ROUTE,
    LECTION_ROUTE,
    ADMIN_PRACTICAL_WORKS_ROUTE,
    STATEMENT_ROUTE,
    ADMIN_ONE_PRACTICAL_WORKS_ROUTE,
    ADMIN_VIEW_LECTION,
    ADMIN_USER_ROUTE,
    ADMIN_STATEMENT_USER,
    ADMIN_ADMINISTRATORS_ROUTE,
    ADMIN_DOCUMENTS_ROUTE,
    ADMIN_VIEW_PRACTICAL_WORKS_ROUTE,
    EXPERT_ROUTE,
    CHAR_PAGE_ROUTE,
    CHAT_USERS_PAGE_ROUTE,
    USER_CHAT_ROUTE,
    ADMIN_REGISTRATE_ADMIN, TEST_OVERVIEW_ROUTE, TEST_ATTEMPT_ROUTE, PDF_ROUTE
} from './shared/utils/consts'
import LoginPage from './pages/LoginPage/LoginPage'
import AdminPage from './pages/admin/AdminPage/AdminPage'
import AdminProgramsPage from './pages/admin/AdminProgramsPage/AdminProgramsPage'
import MakeProgram from './pages/admin/make-program/MakeProgramPage'
import AdminListeners from './pages/admin/AdminListeners/AdminListeners'
import RegistrateUser from './pages/admin/RegistrateUser/RegistrateUser'
import ApplicationPage from './pages/admin/ApplicationPage/ApplicationPage'
import FinishTestPage from './pages/User/FinishTestPage/FinishTestPage'
import VideoPage from './pages/admin/VideoPage/VideoPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import ViewProgram from './pages/admin/ViewProgram/ViewProgram'
import ViewTest from './pages/admin/ViewTest/ViewTest'
import PracticalWorkPage from './pages/User/PracticalWorkPage/PracticalWorkPage'
import LectionPage from './pages/User/LectionPage/LectionPage'
import AdminPracticalPage from './pages/admin/AdminPracticalPage/AdminPracticalPage'
import StatementPage from './pages/User/StatementPage/StatementPage'
import AdminOnePracticalPage from './pages/admin/AdminOnePracticalPage/AdminOnePracticalPage'
import ViewLection from './pages/admin/ViewLection/ViewLection'
import AdminUserPage from './pages/admin/AdminUserPage/AdminUserPage'
import AdminStatementPage from './pages/admin/AdminStatementPage/AdminStatementPage'
import AdministratorsPage from './pages/admin/AdministratorsPage/AdministratorsPage'
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage/AdminDocumentsPage'
import ViewPracticalWorkPage from './pages/admin/ViewPracticalWorkPage/ViewPracticalWorkPage'
import ChatPage from './pages/admin/ChatPage/ChatPage'
import ChatUsersPage from './pages/admin/ChatUsersPage/ChatUsersPage'
import UserChatPage from './pages/User/UserChatPage/UserChatPage'
import RegistrateAdmin from "./pages/admin/RegistrateAdmin/RegistrateAdmin";
import TestOverview from "./pages/User/TestOverview/TestOverview";
import TestAttemptPage from "./pages/User/TestAttemptPage/TestAttemptPage";
import PdfPage from "./pages/User/PdfPage/PdfPage";


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
        path: TEST_OVERVIEW_ROUTE,
        Component: <TestOverview/>
    },
    {
        path: TEST_ATTEMPT_ROUTE,
        Component: <TestAttemptPage/>
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
    },
    {
        path: PDF_ROUTE,
        Component: <PdfPage/>
    },
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
    ,
    {
        path: ADMIN_REGISTRATE_ADMIN,
        Component: <RegistrateAdmin/>
    }
]

export const viewerRoutes = [
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
    ,
    {
        path: ADMIN_REGISTRATE_ADMIN,
        Component: <RegistrateAdmin/>
    }
]

export const publicRoutes = [


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