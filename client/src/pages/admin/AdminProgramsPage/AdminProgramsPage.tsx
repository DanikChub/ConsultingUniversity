import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgram, getAllDraftPrograms, getAllPublishedPrograms } from '../../../entities/program/api/program.api';
import AppContainer from '../../../components/ui/AppContainer';
import Button from '../../../shared/ui/buttons/Button';
import type { Program } from '../../../entities/program/model/type';
import ProgramItem from './components/ProgramItem';
import ProgramsSkeleton from './components/ProgramsSkeleton';

const AdminProgramsPage: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadPrograms = async () => {
        setLoading(true);
        try {
            const data = activeTab === 'published' ? await getAllPublishedPrograms() : await getAllDraftPrograms();
            console.log(data);
            setPrograms(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrograms();
    }, [activeTab]);

    const handleCreateProgram = async () => {
        try {
            const newProgram = await createProgram(1);
            if (!newProgram?.id) throw new Error('Нет ID программы');
            navigate(`/admin/programs/new/${newProgram.id}`);
        } catch (e) {
            console.error(e);
            alert('Не удалось создать программу');
        }
    };

    return (
        <AppContainer>
            {/* Tabs + Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                    <button
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'published'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('published')}
                    >
                        Опубликовано
                    </button>
                    <button
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'draft'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('draft')}
                    >
                        Черновик
                    </button>
                </div>


                <Button
                    onClick={handleCreateProgram}
                    checkRole="ADMIN"
                    className="px-4 py-1.5 text-sm rounded-md bg-[#33CCCC] hover:bg-[#2C3E50] shadow-md transition"
                >
                    + Добавить программу
                </Button>
            </div>

            {/* Program List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <ProgramsSkeleton />
                ) : programs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                        <svg
                            className="w-16 h-16 mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7h18M3 12h18M3 17h18"
                            />
                        </svg>
                        <p className="text-lg font-medium">Программ пока нет</p>
                        <p className="text-sm mt-1">Нажмите «Добавить программу», чтобы создать первую</p>
                    </div>
                ) : (
                    programs.map((program) => <ProgramItem key={program.id} program={program} />)
                )}
            </div>

        </AppContainer>
    );
};

export default AdminProgramsPage;
