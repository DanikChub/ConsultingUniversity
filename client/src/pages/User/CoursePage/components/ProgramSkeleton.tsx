import UserContainer from "../../../../components/ui/UserContainer";

const ProgramSkeleton = () => {
    return (
        <UserContainer loading={true}>
            <div className="space-y-8 animate-pulse">

                {/* Back */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                </div>

                {/* Header */}
                <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                    <div className="flex flex-col lg:flex-row">

                        {/* Image skeleton */}
                        <div className="lg:w-[320px] w-full h-[220px] bg-gray-200" />

                        {/* Content */}
                        <div className="flex-1 p-10 space-y-6">

                            <div className="space-y-3">
                                <div className="h-8 w-2/3 bg-gray-200 rounded" />
                                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                            </div>

                            {/* Progress */}
                            <div className="space-y-2 max-w-xl">
                                <div className="h-4 w-32 bg-gray-200 rounded" />
                                <div className="h-3 w-full bg-gray-200 rounded-full" />
                                <div className="h-4 w-40 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Themes skeleton */}
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
                        >
                            <div className="h-6 w-1/2 bg-gray-200 rounded" />
                            <div className="h-3 w-full bg-gray-200 rounded-full" />
                            <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </UserContainer>
    )
}

export default ProgramSkeleton
