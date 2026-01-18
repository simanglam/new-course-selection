import { MORANDI_PALETTE, STATUS_CONFIG } from "../const"
import { Course, CourseStatus, CourseType, ViewType } from "../types/course"

const isSyllabusDisabled = (courseId: string) => {
    return courseId.startsWith("資工系") || courseId.startsWith("資工所")
}

const CourseModal = ({
    course,
    isOpen,
    onClose,
    status,
    onStatusChange
}: {
    course: Course | null
    isOpen: boolean
    onClose: () => void
    status: CourseStatus
    onStatusChange: (s: CourseStatus) => void
}) => {
    if (!course || !isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#5E5C5C]/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all scale-100 flex flex-col border border-[#E0DCD8]">
                {/* Header Layout */}
                <div className="bg-[#FDFBF7] px-8 py-6 border-b border-[#E0DCD8] z-10 shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[#5E5C5C] mb-1">
                                {course.name}
                            </h2>
                            <div className="flex items-center gap-3 text-sm text-[#9A9694]">
                                <span className="font-medium text-[#748E95] tracking-wide">
                                    {course.code}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#DCD8D2]"></span>
                                <span className="text-[#5E5C5C] font-medium">
                                    {course.professor}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#DCD8D2]"></span>
                                <span className="bg-[#EAE7E2] px-2 py-0.5 rounded text-xs text-[#5E5C5C]">
                                    {course.credits} 學分
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-[#EAE7E2] text-[#9A9694] transition-colors -mr-2 -mt-2">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 md:mt-2 bg-[#F5F4F0] md:bg-transparent rounded-xl p-4 md:p-0">
                        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-end md:gap-x-8 md:gap-y-2 text-sm text-[#5E5C5C]">
                            <div className="flex flex-col md:items-end">
                                <span className="text-[10px] text-[#9A9694] uppercase tracking-wider mb-0.5">
                                    開課年級
                                </span>
                                <span className="font-medium">
                                    {course.targetGrade}
                                </span>
                            </div>
                            <div className="flex flex-col md:items-end">
                                <span className="text-[10px] text-[#9A9694] uppercase tracking-wider mb-0.5">
                                    時間地點
                                </span>
                                <span className="font-medium">
                                    {course.time} {course.location}
                                </span>
                            </div>
                            
                            <div className="flex flex-col md:items-end">
                                <span className="text-[10px] text-[#9A9694] uppercase tracking-wider mb-0.5">
                                    限修人數
                                </span>
                                <span className="font-medium">
                                    {course.capacity} 人
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-[#FDFBF7]">
                    {/* I. Course Description */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                            課程概述
                        </h3>
                        <p className="text-sm text-[#5E5C5C] leading-relaxed bg-[#F5F4F0] p-5 rounded-2xl border border-[#E0DCD8]/50">
                            {course.description}
                        </p>
                    </section>

                    {/* II. Syllabus */}
                    {!isSyllabusDisabled(course.id) && (
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                                課程大綱
                            </h3>
                            <a
                                href={course.syllabusUrl}
                                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-[#DCD8D2] text-[#748E95] hover:bg-[#748E95] hover:text-white transition-colors text-sm font-medium gap-2 shadow-sm">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                下載課程大綱 PDF
                            </a>
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* III. Teaching Materials */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                                教學教材
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {course.teachingMaterials.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-lg bg-[#EAE7E2] text-[#5E5C5C] text-xs font-medium border border-[#DCD8D2]/50">
                                        {item}
                                    </span>
                                ))}
                                {course.teachingMaterials.length === 0 && (
                                    <span className="text-xs text-[#9A9694]">
                                        無特定教材
                                    </span>
                                )}
                            </div>
                        </section>

                        {/* IV. Teaching Methods */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                                教學方式
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {course.teachingMethods.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-lg bg-[#EAE7E2] text-[#5E5C5C] text-xs font-medium border border-[#DCD8D2]/50">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* V. Assessment Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                            評量方式
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {course.assessmentMethods.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] text-[#B09E99] border border-[#D6A39F]/20 text-xs font-medium">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#748E95] uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#748E95]"></span>
                            備註
                        </h3>
                        <p className="text-sm text-[#5E5C5C] leading-relaxed bg-[#F5F4F0] p-5 rounded-2xl border border-[#E0DCD8]/50">
                            {course.memo}
                        </p>
                    </section>
                    </div>
                </div>

                {/* Footer: Tags & Status */}
                <div className="bg-[#F2F0EB] px-8 py-4 border-t border-[#E0DCD8] shrink-0 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/*<div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {course.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-[10px] tracking-wide rounded-full border border-[#DCD8D2] text-[#9A9694] bg-white/50">
                                #{tag}
                            </span>
                        ))}
                    </div> */}

                    <div className="bg-white p-1 rounded-2xl shadow-sm flex gap-1 border border-[#E0DCD8]">
                        {(
                            Object.keys(STATUS_CONFIG) as Array<
                                keyof typeof STATUS_CONFIG
                            >
                        ).map((s) => (
                            <button
                                key={s}
                                onClick={() =>
                                    onStatusChange(status === s ? "none" : s)
                                }
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                                    status === s
                                        ? "bg-[#5E5C5C] text-white shadow-md animate-pop ring-2 ring-offset-1 ring-offset-[#FDFBF7] ring-[#5E5C5C]"
                                        : "text-[#9A9694] hover:bg-[#F5F4F0] hover:text-[#5E5C5C] hover:scale-105 active:scale-95"
                                }`}>
                                <span
                                    className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${status === s ? "bg-white" : ""}`}
                                    style={{
                                        backgroundColor:
                                            status === s
                                                ? "#fff"
                                                : STATUS_CONFIG[s].color
                                    }}></span>
                                {STATUS_CONFIG[s].label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseModal