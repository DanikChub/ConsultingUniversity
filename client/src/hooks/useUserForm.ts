import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAllPublishedPrograms } from '../entities/program/api/program.api';
import {
    addUserDocuments,
    deleteUserDocument,
    getUserById,
    registrateAdmin,
    registrateUser,
    remakeAdmin,
    remakeUser,
    setUserProfileImg
} from '../entities/user/api/user.api';
import { UserDocument } from '../entities/user/model/type';
import { ADMIN_ADMINISTRATORS_ROUTE, ADMIN_LISTENERS_ROUTE } from '../shared/utils/consts';

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

    const [passport, setPassport] = useState('');
    const [educationDocument, setEducationDocument] = useState('');
    const [snils, setSnils] = useState('');

    const [documents, setDocuments] = useState<File[]>([]);
    const [existingDocuments, setExistingDocuments] = useState<UserDocument[]>([]);

    const [programInput, setProgramInput] = useState('');
    const [programs, setPrograms] = useState<any[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
    const [selectedPrograms, setSelectedPrograms] = useState<any[]>([]);
    const [userProgramId, setUserProgramId] = useState<number[]>([]);

    const [adminSignature, setAdminSignature] = useState('');
    const [profileImg, setProfileImg] = useState<File | null>(null);
    const [currentProfileImg, setCurrentProfileImg] = useState<string | null>(null);

    const [validate, setValidate] = useState(false);
    const [serverMessage, setServerMessage] = useState('');

    const [datalistActive, setDatalistActive] = useState(false);

    const params = useParams();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(true);

    const validateFields = useCallback(() => {
        if (!name || !email || !phone) return false;
        return true;
    }, [name, email, phone]);

    useEffect(() => {
        (async () => {
            setLoaded(false);
            try {
                const all = await getAllPublishedPrograms();
                setPrograms(all);
                setFilteredPrograms(all);

                if (params.id) {
                    const user = await getUserById(params.id);

                    setName(user.name || '');
                    setEmail(user.email || '');
                    setPhone(user.number || '');
                    setOrg(user.organization || '');
                    setInn(user.inn || '');
                    setDiplom(user.diplom || false);
                    setAddress(user.address || '');

                    setPassport(user.passport || '');
                    setEducationDocument(user.education_document || '');
                    setSnils(user.snils || '');
                    setExistingDocuments(user.documents || []);
                    setAdminSignature(user.admin_signature || '');
                    setCurrentProfileImg(user.img || null);

                    if (user.role !== 'USER') {
                        setRole(user.role);
                    }

                    if (!queryParams.get('admin')) {
                        setSelectedPrograms(user.programs || []);
                        setUserProgramId(user.programs ? user.programs.map((p: any) => p.id) : []);
                    }
                }

                setLoaded(true);
            } catch (err) {
                console.error('Load error:', err);
            } finally {
                setLoaded(true);
            }
        })();
    }, [params.id, queryParams]);

    const handleChangeProgram = useCallback((value: string) => {
        setProgramInput(value);
        setDatalistActive(value.length > 0);

        let filtered;
        if (value) {
            filtered = programs
                .filter((p: any) => p.title.toLowerCase().includes(value.toLowerCase()))
                .map((p: any) => ({ ...p, yellow_value: value }));
        } else {
            filtered = programs;
        }

        setFilteredPrograms(filtered);
    }, [programs]);

    const handleSelectRole = (newRole: 'ADMIN' | 'VIEWER') => {
        setRole(newRole);
    };

    const handleSelectProgram = useCallback((program: any) => {
        setSelectedPrograms([program]);
        setUserProgramId([program.id]);
        setDatalistActive(false);
    }, []);

    const deleteSelectedProgram = useCallback(() => {
        setSelectedPrograms([]);
        setUserProgramId([]);
    }, []);

    const handleDiplomCheck = (checked: boolean) => {
        setDiplom(checked);
        if (checked) setAddress('');
    };

    const handleDocumentsChange = (files: FileList | null) => {
        if (!files) return;

        const filesArray = Array.from(files);
        setDocuments((prev) => [...prev, ...filesArray]);
    };

    const removeNewDocument = (index: number) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingDocument = async (documentId: number) => {
        try {
            await deleteUserDocument(documentId);
            setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        } catch (err: any) {
            setServerMessage(err?.response?.data?.message || 'Ошибка удаления документа');
        }
    };

    const createUser = useCallback(async () => {
        setValidate(false);
        setServerMessage('');

        if (!validateFields()) {
            setValidate(true);
            return;
        }

        try {
            if (params.id) {
                if (queryParams.get('admin')) {
                    await remakeAdmin(
                        params.id,
                        email,
                        password,
                        role,
                        name,
                        phone,
                        adminSignature
                    );

                    if (profileImg) {
                        const formData = new FormData();
                        formData.append('img', profileImg);
                        formData.append('id', String(params.id));
                        await setUserProfileImg(formData);
                    }

                    navigate(ADMIN_ADMINISTRATORS_ROUTE);
                } else {
                    await remakeUser({
                        id: Number(params.id),
                        email,
                        password,
                        role: 'USER',
                        name,
                        number: phone,
                        organization: org,
                        programs_id: userProgramId,
                        diplom,
                        inn,
                        address,
                        passport,
                        education_document: educationDocument,
                        snils,
                    });

                    if (documents.length > 0) {
                        await addUserDocuments(Number(params.id), documents);
                    }

                    if (profileImg) {
                        const formData = new FormData();
                        formData.append('img', profileImg);
                        formData.append('id', String(params.id));
                        await setUserProfileImg(formData);
                    }

                    navigate(ADMIN_LISTENERS_ROUTE);
                }
            } else {
                if (queryParams.get('admin')) {
                    await registrateAdmin(
                        email,
                        password,
                        role,
                        name,
                        phone,
                        adminSignature
                    );

                    navigate(ADMIN_ADMINISTRATORS_ROUTE);
                } else {
                    await registrateUser({
                        email,
                        password,
                        role: 'USER',
                        name,
                        number: phone,
                        organization: org,
                        programs_id: userProgramId,
                        diplom,
                        inn,
                        address,
                        passport,
                        education_document: educationDocument,
                        snils,
                    });

                    navigate(ADMIN_LISTENERS_ROUTE);
                }
            }
        } catch (err: any) {
            setServerMessage(err?.response?.data?.message || 'Ошибка сервера');
        }
    }, [
        params.id,
        queryParams,
        email,
        password,
        role,
        name,
        phone,
        org,
        userProgramId,
        diplom,
        inn,
        address,
        passport,
        educationDocument,
        snils,
        documents,
        adminSignature,
        profileImg,
        navigate,
        validateFields
    ]);

    return {
        role, handleSelectRole,
        name, setName,
        email, setEmail,
        password, setPassword,
        phone, setPhone,
        org, setOrg,
        inn, setInn,
        address, setAddress,
        diplom, setDiplom,
        serverMessage,

        passport, setPassport,
        educationDocument, setEducationDocument,
        snils, setSnils,

        adminSignature, setAdminSignature,
        profileImg, setProfileImg,
        currentProfileImg,
        setCurrentProfileImg,

        documents,
        existingDocuments,
        handleDocumentsChange,
        removeNewDocument,
        handleDeleteExistingDocument,

        programInput,
        filteredPrograms,
        selectedPrograms,
        datalistActive,

        handleChangeProgram,
        handleSelectProgram,
        deleteSelectedProgram,
        handleDiplomCheck,
        createUser,

        validate,
        params,
        navigate,
        loaded
    };
};