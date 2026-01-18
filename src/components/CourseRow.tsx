import { MORANDI_PALETTE, STATUS_CONFIG } from "../const"
import { Course, CourseStatus, CourseType, ViewType } from "../types/course"

const isSyllabusDisabled = (courseId: string) => {
    return courseId.startsWith("資工系") || courseId.startsWith("資工所")
}

const CourseRow = ({
    course,
    status,
    onClick
}: {
    course: Course
    status: CourseStatus
    onClick: () => void
}) => {
    const statusInfo =
        status !== "none"
            ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
            : null

    return (
        <div
            onClick={onClick}
            className="group bg-[#FDFBF7] rounded-2xl p-4 border border-[#E0DCD8] hover:border-[#B09E99] hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer relative flex flex-col md:flex-row md:items-center gap-4 hover-lift">
            {/* 1. Left Section: Status, Name, Prof, ID, Credits */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                    {statusInfo && (
                        <span
                            className="px-2.5 py-0.5 text-[10px] font-bold rounded-full text-white shadow-sm shrink-0 animate-scaleIn"
                            style={{ backgroundColor: statusInfo.color }}>
                            {statusInfo.label.split(" ")[0]}
                        </span>
                    )}
                    {/* Name */}
                    <h3 className="text-lg font-bold text-[#5E5C5C] group-hover:text-[#748E95] transition-colors truncate">
                        {course.name}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#9A9694]">
                    {/* ID Pill */}
                    <span className="px-2 py-0.5 font-medium tracking-wide rounded bg-[#EAE7E2] text-[#748E95]">
                        {course.code}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#DCD8D2]"></span>
                    <span className="font-medium">{course.professor}</span>
                    <span className="w-1 h-1 rounded-full bg-[#DCD8D2]"></span>
                    <span className="text-[#748E95] font-bold">
                        {course.credits}學分
                    </span>
                </div>
            </div>

            {/* 2. Right Section: Metadata Horizontal Layout (Compact) */}
            <div className="flex-none flex flex-wrap md:flex-nowrap items-center gap-y-2 gap-x-6 text-xs text-[#5E5C5C]">
                {/* Grade & Capacity */}
                <div className="w-24 shrink-0">
                    <div className="text-[9px] text-[#B0B0B0] uppercase tracking-wider mb-0.5">
                        年級 / 人數
                    </div>
                    <div className="font-medium text-[#9A9694]">
                        {course.targetGrade} /{" "}
                        <span className="text-[#5E5C5C]">
                            {course.capacity}
                        </span>
                    </div>
                </div>

                {/* Time & Location */}
                <div className="w-32 shrink-0">
                    <div className="text-[9px] text-[#B0B0B0] uppercase tracking-wider mb-0.5">
                        時間地點
                    </div>
                    <div
                        className="font-medium truncate"
                        title={`${course.time} ${course.location}`}>
                        {course.time}{" "}
                        <span className="text-[#9A9694]">
                            {course.location}
                        </span>
                    </div>
                </div>

                {/* Restrictions */}
                {/* <div className="w-20 shrink-0 hidden lg:block">
                    <div className="text-[9px] text-[#B0B0B0] uppercase tracking-wider mb-0.5">
                        擋修
                    </div>
                    <div
                        className="font-medium text-[#9A9694] truncate"
                        title={course.restrictions}>
                        {course.restrictions === "無"
                            ? "-"
                            : course.restrictions}
                    </div>
                </div>
                */}


                {/* Download Action */}
                
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            window.open(course.syllabusUrl, "_blank")
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F4F0] text-[#B09E99] hover:bg-[#748E95] hover:text-white transition-all shadow-sm border border-[#E0DCD8] shrink-0 hover:scale-110 active:scale-90"
                        title="下載大綱">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </button>
                
            </div>
        </div>
    )
}

export default CourseRow