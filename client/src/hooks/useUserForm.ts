import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAllPrograms, getOneProgram } from '../http/programAPI';
import { getUserById, registrateAdmin, registrateUser, remakeAdmin, remakeUser } from '../http/userAPI';
import { ADMIN_ADMINISTRATORS_ROUTE, ADMIN_LISTENERS_ROUTE } from '../utils/consts';

export const useUserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [org, setOrg] = useState('');
    const [inn, setInn] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [diplom, setDiplom] = useState(false);
    const [role, setRole] = useState('ADMIN');

    const [programInput, setProgramInput] = useState('');
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [userProgramId, setUserProgramId] = useState([]);

    const [validate, setValidate] = useState(false);
    const [serverMessage, setServerMessage] = useState('');

    const [datalistActive, setDatalistActive] = useState(false);

    const params = useParams();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(true)

    // ========== VALIDATION ==========
    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    const validatePhone = (phone: string) =>
        /^\+?[0-9]{10,15}$/.test(phone.replace(/\D/g, ''));

    const validateInn = (inn: string) =>
        /^[0-9]{10,12}$/.test(inn.replace(/\D/g, ''));

    const validateFields = useCallback(() => {
        if (!name || !email || !phone) return false;
        // if (!validateEmail(email)) return false;
        // if (!validatePhone(phone)) return false;
        // if (org && !validateInn(inn)) return false;
        // if (!queryParams.get('admin') && !userProgramId[0]) return false;
        // if (!params.id && !password) return false;
        return true;
    }, [name, email, phone, org, inn, userProgramId, password]);

    // ========== LOAD ==========
    useEffect(() => {

        (async () => {
            setLoaded(false)
            try {
                const all = await getAllPrograms();
                setPrograms(all);
                setFilteredPrograms(all);

                if (params.id) {
                    const user = await getUserById(params.id);

                    setName(user.name);
                    setEmail(user.email);
                    setPhone(user.number);
                    setOrg(user.organiztion || '');
                    setInn(user.inn || '');
                    setDiplom(user.diplom || false);
                    setAddress(user.address || '');
                    setUserProgramId(user.programs_id);

                    if (!queryParams.get('admin') && user.programs_id[0]) {
                        const program = await getOneProgram(user.programs_id[0]);
                        setSelectedPrograms([program]);

                    }
                }
                setLoaded(true)


            } catch (err) {
                console.error('Load error:', err);
            }
        })();
    }, [params.id]);

    // ========== PROGRAM HANDLERS ==========
    const handleChangeProgram = useCallback((value: string) => {
        setProgramInput(value);
        setDatalistActive(value.length > 0);
        let filtered;
        if (value) {
            filtered = programs
                .filter(p => p.title.toLowerCase().includes(value.toLowerCase()))
                .map(p => ({ ...p, yellow_value: value }));
        } else {
            filtered = programs

        }


        setFilteredPrograms(filtered);
    }, [programs]);

    const handleSelectProgram = useCallback((program) => {
        setSelectedPrograms([program]);
        console.log(programs)
        setUserProgramId([program.id]);
        setDatalistActive(false);
    }, []);

    const deleteSelectedProgram = useCallback(() => {
        setSelectedPrograms([]);
        setUserProgramId([]);
    }, []);

    // ========== DIPLOM ==========
    const handleDiplomCheck = (checked: boolean) => {
        setDiplom(checked);
        if (checked) setAddress('');
    };

    // ========== SAVE ==========
    const createUser = useCallback(async () => {
        setValidate(false);
        console.log('создается до')
        if (!validateFields()) {
            setValidate(true);
            return;
        }
        
        try {
            if (params.id) {
                if (queryParams.get('admin')) {
                    await remakeAdmin(params.id, email, password, name, phone);
                    navigate(ADMIN_ADMINISTRATORS_ROUTE);
                } else {
                    await remakeUser(params.id, email, password, 'USER', name, phone, org, userProgramId, diplom, inn, address);
                    navigate(ADMIN_LISTENERS_ROUTE);
                }
            } else {
                if (queryParams.get('admin')) {
                    await registrateAdmin(email, password, role, name, phone);
                    navigate(ADMIN_ADMINISTRATORS_ROUTE);
                } else {
                    await registrateUser(email, password, 'USER', name, phone, org, userProgramId, diplom, inn, address);
                    navigate(ADMIN_LISTENERS_ROUTE);
                }
            }
        } catch (err: any) {
            setServerMessage(err?.response?.data?.message || 'Ошибка сервера');
        }
    }, [params.id, email, password, name, phone, org, userProgramId, diplom, inn, address]);

    return {
        // DATA
        role, setRole,
        name, setName,
        email, setEmail,
        password, setPassword,
        phone, setPhone,
        org, setOrg,
        inn, setInn,
        address, setAddress,
        diplom, setDiplom,
        serverMessage,

        programInput,
        filteredPrograms,
        selectedPrograms,
        datalistActive,

        // HANDLERS
        handleChangeProgram,
        handleSelectProgram,
        deleteSelectedProgram,
        handleDiplomCheck,
        createUser,

        // FLAGS
        validate,
        params,
        navigate,
        loaded
    };
};
