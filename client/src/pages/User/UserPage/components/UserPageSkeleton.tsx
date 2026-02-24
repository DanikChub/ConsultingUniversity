// components/skeletons/UserPageSkeleton.tsx
import React from "react";

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 animate-pulse ${className}`} />
);

const UserPageSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">

                {/* Profile + Greeting */}
                <div className="flex items-center mb-8 md:mb-0">
                    <SkeletonBlock className="w-[130px] h-[130px] rounded-full" />

                    <div className="ml-12 space-y-4">
                        <SkeletonBlock className="h-6 w-64 rounded-md" />
                        <SkeletonBlock className="h-6 w-80 rounded-md" />
                    </div>
                </div>

                {/* Chat */}
                <div className="flex items-center ml-0 md:ml-12 mb-8 md:mb-0">
                    <SkeletonBlock className="w-[100px] h-[69px] rounded-lg" />
                    <div className="ml-8 space-y-2">
                        <SkeletonBlock className="h-6 w-40 rounded-md" />
                        <SkeletonBlock className="h-6 w-32 rounded-md" />
                    </div>
                </div>

                {/* Statement */}
                <div className="flex items-center ml-0 md:ml-12">
                    <SkeletonBlock className="w-40 h-24 rounded-lg" />
                    <div className="ml-4">
                        <SkeletonBlock className="h-6 w-40 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Program Section */}
            <div className="mt-16">
                <SkeletonBlock className="h-8 w-48 mb-6 rounded-md" />

                <div className="block relative rounded-3xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* Cover */}
                        <SkeletonBlock className="lg:w-[320px] w-full min-h-[220px] lg:rounded-l-3xl" />

                        {/* Content */}
                        <div className="flex-1 p-10 space-y-6">

                            {/* Title */}
                            <div className="space-y-4">
                                <SkeletonBlock className="h-8 w-80 rounded-md" />
                                <SkeletonBlock className="h-4 w-40 rounded-md" />
                            </div>

                            {/* Progress */}
                            <div className="max-w-xl space-y-3">
                                <div className="flex justify-between">
                                    <SkeletonBlock className="h-4 w-32 rounded-md" />
                                    <SkeletonBlock className="h-4 w-12 rounded-md" />
                                </div>

                                <SkeletonBlock className="h-3 w-full rounded-full" />

                                <SkeletonBlock className="h-4 w-40 rounded-md" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserPageSkeleton;
