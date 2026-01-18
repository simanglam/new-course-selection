/* const Timetable = ({
    myCourses,
    courseStatuses,
    selectedDept
}: {
    myCourses: Course[]
    courseStatuses: Record<string, CourseStatus>
    selectedDept: string
}) => {
    const days = ["一", "二", "三", "四", "五"]

    // Helper to find course at specific slot
    const getCourseAtSlot = (day: string, period: number) => {
        return myCourses.find((c) => {
            // Only show Selected courses in the main grid to avoid clutter,
            // or show both but visually distinct. Let's show selected only for grid clarity as requested by "Timetable".
            if (courseStatuses[c.id] !== "selected") return false

            const parsed = parseTime(c.time)
            if (!parsed) return false
            return (
                parsed.day === day &&
                period >= parsed.start &&
                period <= parsed.end
            )
        })
    }

    // Conflict Detection Logic
    const conflictingCourseIds = useMemo(() => {
        const ids = new Set<string>()
        const activeCourses = myCourses.filter(
            (c) =>
                courseStatuses[c.id] === "selected" ||
                courseStatuses[c.id] === "considering"
        )

        for (let i = 0; i < activeCourses.length; i++) {
            for (let j = i + 1; j < activeCourses.length; j++) {
                const c1 = activeCourses[i]
                const c2 = activeCourses[j]
                const t1 = parseTime(c1.time)
                const t2 = parseTime(c2.time)

                if (t1 && t2 && t1.day === t2.day) {
                    // Check for overlap
                    if (
                        Math.max(t1.start, t2.start) <= Math.min(t1.end, t2.end)
                    ) {
                        ids.add(c1.id)
                        ids.add(c2.id)
                    }
                }
            }
        }
        return ids
    }, [myCourses, courseStatuses])

    // Grouping Logic
    const conflictCourses = myCourses.filter((c) =>
        conflictingCourseIds.has(c.id)
    )

    // Filter out conflicts from selected/considering to avoid duplication in display
    const selectedCourses = myCourses.filter(
        (c) =>
            courseStatuses[c.id] === "selected" &&
            !conflictingCourseIds.has(c.id)
    )
    const consideringCourses = myCourses.filter(
        (c) =>
            courseStatuses[c.id] === "considering" &&
            !conflictingCourseIds.has(c.id)
    )

    // Tag Groups (e.g. General Education)
    const generalEdCourses = myCourses.filter((c) => c.type === "通識")

    const selectedCredits = selectedCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )
    const consideringCredits = consideringCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )
    const conflictCredits = conflictCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )

    return (
        <div className="flex flex-col lg:flex-row h-full">
            {// 1. Main Timetable Grid (Left/Top) }
            <div className="flex-1 p-4 md:p-8 flex flex-col min-w-0">
                <h2 className="text-2xl font-bold text-[#5E5C5C] mb-4 flex items-center gap-3">
                    <span>我的課表</span>
                    <span className="text-sm font-normal text-[#9A9694] bg-[#EAE7E2] px-3 py-1 rounded-full">
                        {selectedCredits + conflictCredits} 學分
                    </span>
                </h2>

                <div className="bg-[#FDFBF7] rounded-3xl shadow-sm border border-[#E0DCD8] flex-1 flex flex-col relative">
                    
                    <div className="grid grid-cols-6 border-b border-[#E0DCD8] bg-[#F5F4F0] flex-shrink-0">
                        <div className="p-3 text-center text-[10px] md:text-xs font-bold text-[#9A9694] uppercase tracking-wider border-r border-[#E0DCD8]">
                            節次
                        </div>
                        {days.map((day) => (
                            <div
                                key={day}
                                className="p-3 text-center text-sm font-bold text-[#5E5C5C] border-r border-[#E0DCD8] last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                   
                    <div className="flex-1">
                        {CCU_PERIODS.map((period) => (
                            <div
                                key={period.id}
                                className="grid grid-cols-6 border-b border-[#E0DCD8] last:border-b-0 min-h-[70px]">
                                
                                <div className="flex flex-col items-center justify-center p-1 border-r border-[#E0DCD8] bg-[#F5F4F0]/50 text-[#9A9694]">
                                    <span className="text-base font-bold leading-none mb-0.5">
                                        {period.label}
                                    </span>
                                    <span className="text-[9px] font-medium opacity-80 whitespace-nowrap">
                                        {period.start}
                                    </span>
                                    <span className="text-[9px] font-medium opacity-80 whitespace-nowrap">
                                        {period.end}
                                    </span>
                                </div>

                                
                                {days.map((day) => {
                                    const course = getCourseAtSlot(
                                        day,
                                        period.id
                                    )
                                    // Highlight Logic: Check if course matches selected department
                                    const isHighlight =
                                        course &&
                                        course.id.startsWith(selectedDept)
                                    const isConflict =
                                        course &&
                                        conflictingCourseIds.has(course.id)

                                    // Style logic
                                    let bgClass = "bg-[#EAE7E2]"
                                    let borderClass = "border-[#748E95]"

                                    if (isConflict) {
                                        bgClass = "bg-[#D6A39F]/20"
                                        borderClass = "border-[#D6A39F]"
                                    }

                                    const opacityClass = course
                                        ? isHighlight
                                            ? "opacity-100 scale-100 grayscale-0"
                                            : "opacity-30 grayscale scale-[0.96]"
                                        : ""

                                    return (
                                        <div
                                            key={`${day}-${period.id}`}
                                            className="p-1 border-r border-[#E0DCD8] last:border-r-0 relative group">
                                            {course && (
                                                <div
                                                    className={`w-full h-full ${bgClass} rounded-lg p-1.5 flex flex-col justify-center border-l-4 ${borderClass} hover:bg-[#DCD8D2] transition-all duration-500 ease-in-out cursor-pointer shadow-sm relative group/cell ${opacityClass}`}>
                                                    <div
                                                        className={`text-[10px] md:text-xs font-bold line-clamp-1 ${isConflict ? "text-[#D6A39F]" : "text-[#5E5C5C]"}`}>
                                                        {isConflict && "⚠️ "}
                                                        {course.name}
                                                    </div>
                                                    <div className="text-[9px] text-[#9A9694] mt-0.5 line-clamp-1">
                                                        {course.location}
                                                    </div>

                                                    {!isSyllabusDisabled(
                                                        course.id
                                                    ) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                window.open(
                                                                    course.syllabusUrl,
                                                                    "_blank"
                                                                )
                                                            }}
                                                            className="absolute bottom-1 right-1 p-1 rounded-full bg-white text-[#748E95] shadow-sm opacity-0 group-hover/cell:opacity-100 transition-opacity hover:bg-[#748E95] hover:text-white transform scale-90 hover:scale-100"
                                                            title="下載大綱">
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 bg-[#F5F4F0] border-t lg:border-t-0 lg:border-l border-[#DCD8D2] flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-[#E0DCD8]">
                    <h3 className="text-lg font-bold text-[#5E5C5C] uppercase tracking-wider">
                        課程清單
                    </h3>
                </div>

                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {conflictCourses.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[#D6A39F]">
                                    <span className="w-2 h-2 rounded-full bg-[#D6A39F]"></span>
                                    時間衝突 (Time Conflict)
                                </h4>
                                <span className="text-xs font-medium text-white bg-[#D6A39F] px-2 py-0.5 rounded animate-pulse">
                                    請檢查
                                </span>
                            </div>
                            <div className="space-y-2">
                                {conflictCourses.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-[#FFF5F5] p-3 rounded-xl border-2 border-[#D6A39F] shadow-sm flex flex-col gap-1 hover-lift">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-[#D6A39F] line-clamp-1">
                                                ⚠️ {c.name}
                                            </span>
                                            <span className="text-[10px] text-[#9A9694] bg-white px-1.5 py-0.5 rounded">
                                                {c.credits}學分
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-[#5E5C5C] flex flex-col gap-0.5 mt-1 font-medium">
                                            <span className="truncate">
                                                {c.professor}
                                            </span>
                                            <span className="text-[#D6A39F]">
                                                {formatCourseTime(c.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#748E95]">
                                <span className="w-2 h-2 rounded-full bg-[#748E95]"></span>
                                已選 (Primary Choice)
                            </h4>
                            <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                {selectedCredits} 學分
                            </span>
                        </div>
                        {selectedCourses.length > 0 ? (
                            <div className="space-y-2">
                                {selectedCourses.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-white p-3 rounded-xl border border-[#E0DCD8] shadow-sm flex flex-col gap-1 hover-lift">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-[#5E5C5C] line-clamp-1">
                                                {c.name}
                                            </span>
                                            <span className="text-[10px] text-[#9A9694] bg-[#F5F4F0] px-1.5 py-0.5 rounded">
                                                {c.credits}學分
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-[#9A9694] flex flex-col gap-0.5 mt-1">
                                            <span className="truncate">
                                                {c.professor}
                                            </span>
                                            <span className="text-[#5E5C5C] font-medium">
                                                {formatCourseTime(c.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[#B0B0B0] text-center py-4 border border-dashed border-[#DCD8D2] rounded-xl">
                                尚無已選課程
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#A3B1C2]">
                                <span className="w-2 h-2 rounded-full bg-[#A3B1C2]"></span>
                                考慮 (Backup)
                            </h4>
                            <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                {consideringCredits} 學分
                            </span>
                        </div>
                        {consideringCourses.length > 0 ? (
                            <div className="space-y-2">
                                {consideringCourses.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-white p-3 rounded-xl border border-[#E0DCD8] shadow-sm flex flex-col gap-1 opacity-80 hover:opacity-100 transition-opacity hover-lift">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-[#5E5C5C] line-clamp-1">
                                                {c.name}
                                            </span>
                                            <span className="text-[10px] text-[#9A9694] bg-[#F5F4F0] px-1.5 py-0.5 rounded">
                                                {c.credits}學分
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-[#9A9694] flex flex-col gap-0.5 mt-1">
                                            <span className="truncate">
                                                {c.professor}
                                            </span>
                                            <span className="text-[#5E5C5C] font-medium">
                                                {formatCourseTime(c.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[#B0B0B0] text-center py-4 border border-dashed border-[#DCD8D2] rounded-xl">
                                尚無考慮課程
                            </div>
                        )}
                    </section>

                    
                    {generalEdCourses.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[#B09E99]">
                                    <span className="w-2 h-2 rounded-full bg-[#B09E99]"></span>
                                    通識
                                </h4>
                                <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                    {
                                        generalEdCourses.filter(
                                            (c) =>
                                                courseStatuses[c.id] ===
                                                "selected"
                                        ).length
                                    }{" "}
                                    門已選
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {generalEdCourses.map((c) => (
                                    <span
                                        key={c.id}
                                        className={`text-[10px] px-2 py-1 rounded border ${courseStatuses[c.id] === "selected" ? "bg-[#B09E99] text-white border-[#B09E99]" : "bg-white text-[#9A9694] border-[#DCD8D2]"}`}>
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
*/

import { useMemo } from "react"
import { Course, CourseStatus } from "../types/course"
import CourseRow from "./CourseRow"

const parseTime = (timeStr: string) => {
    const match = timeStr.match(/([一二三四五])\s+(\d+),(\d+)/)
    if (!match) return null
    return {
        day: match[1],
        start: parseInt(match[2]),
        end: parseInt(match[3])
    }
}

const formatCourseTime = (timeStr: string) => {
    const parsed = parseTime(timeStr)
    if (!parsed) return timeStr

    const dayMap: Record<string, string> = {
        一: "週一",
        二: "週二",
        三: "週三",
        四: "週四",
        五: "週五"
    }

    const startPeriod = CCU_PERIODS.find((p) => p.id === parsed.start)
    const endPeriod = CCU_PERIODS.find((p) => p.id === parsed.end)

    if (startPeriod && endPeriod) {
        return `${dayMap[parsed.day] || parsed.day} ${startPeriod.start} - ${endPeriod.end}`
    }
    return timeStr
}

const CCU_PERIODS = [
    { id: 1, label: "1", start: "07:10", end: "08:00" },
    { id: 2, label: "2", start: "08:10", end: "09:00" },
    { id: 3, label: "3", start: "09:10", end: "10:00" },
    { id: 4, label: "4", start: "10:10", end: "11:00" },
    { id: 5, label: "5", start: "11:10", end: "12:00" },
    { id: 6, label: "6", start: "12:10", end: "13:00" },
    { id: 7, label: "7", start: "13:10", end: "14:00" },
    { id: 8, label: "8", start: "14:10", end: "15:00" },
    { id: 9, label: "9", start: "15:10", end: "16:00" },
    { id: 10, label: "10", start: "16:10", end: "17:00" },
    { id: 11, label: "11", start: "17:10", end: "18:00" },
    { id: 12, label: "12", start: "18:10", end: "19:00" },
    { id: 13, label: "13", start: "19:10", end: "20:00" },
    { id: 14, label: "14", start: "20:10", end: "21:00" },
    { id: 15, label: "15", start: "21:10", end: "22:00" }
]

const Timetable = ({
    myCourses,
    courseStatuses,
    selectedDept,
    onCourseClick
}: {
    myCourses: Course[]
    courseStatuses: Record<string, CourseStatus>
    selectedDept: string
    onCourseClick: (course: Course) => void
}) => {
    const days = ["一", "二", "三", "四", "五"]

    // Helper to find course at specific slot
    const getCourseAtSlot = (day: string, period: number) => {
        return myCourses.find((c) => {
            // Only show Selected courses in the main grid to avoid clutter,
            // or show both but visually distinct. Let's show selected only for grid clarity as requested by "Timetable".
            if (courseStatuses[`${c.name}-${c.professor}`] !== "selected") return false

            const parsed = parseTime(c.time)
            if (!parsed) return false
            return (
                parsed.day === day &&
                period >= parsed.start &&
                period <= parsed.end
            )
        })
    }

    // Conflict Detection Logic
    const conflictingCourseIds = useMemo(() => {
        const ids = new Set<string>()
        const activeCourses = myCourses.filter(
            (c) =>
                courseStatuses[`${c.name}-${c.professor}`] === "selected" ||
                courseStatuses[`${c.name}-${c.professor}`] === "considering"
        )

        for (let i = 0; i < activeCourses.length; i++) {
            for (let j = i + 1; j < activeCourses.length; j++) {
                const c1 = activeCourses[i]
                const c2 = activeCourses[j]
                const t1 = parseTime(c1.time)
                const t2 = parseTime(c2.time)

                if (t1 && t2 && t1.day === t2.day) {
                    // Check for overlap
                    if (
                        Math.max(t1.start, t2.start) <= Math.min(t1.end, t2.end)
                    ) {
                        ids.add(c1.id)
                        ids.add(c2.id)
                    }
                }
            }
        }
        return ids
    }, [myCourses, courseStatuses])

    // Grouping Logic
    const conflictCourses = myCourses.filter((c) =>
        conflictingCourseIds.has(c.id)
    )

    // Filter out conflicts from selected/considering to avoid duplication in display
    const selectedCourses = myCourses.filter(
        (c) =>
            courseStatuses[`${c.name}-${c.professor}`] === "selected" &&
            !conflictingCourseIds.has(c.id)
    )
    const consideringCourses = myCourses.filter(
        (c) =>
            courseStatuses[`${c.name}-${c.professor}`] === "considering" &&
            !conflictingCourseIds.has(c.id)
    )

    // Tag Groups (e.g. General Education)
    const generalEdCourses = myCourses.filter((c) => c.type === "通識")

    const selectedCredits = selectedCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )
    const consideringCredits = consideringCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )
    const conflictCredits = conflictCourses.reduce(
        (sum, c) => sum + c.credits,
        0
    )

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <div className="w-full bg-[#F5F4F0] border-t lg:border-t-0 lg:border-l border-[#DCD8D2] flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-[#E0DCD8]">
                    <h3 className="text-lg font-bold text-[#5E5C5C] uppercase tracking-wider">
                        課程清單
                    </h3>
                </div>

                <div className="flex-1 p-6 space-y-8 overflow-y-auto  w-full">
                    {conflictCourses.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[#D6A39F]">
                                    <span className="w-2 h-2 rounded-full bg-[#D6A39F]"></span>
                                    時間衝突 (Time Conflict)
                                </h4>
                                <span className="text-xs font-medium text-white bg-[#D6A39F] px-2 py-0.5 rounded animate-pulse">
                                    請檢查
                                </span>
                            </div>
                            <div className="space-y-2">
                                {conflictCourses.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-[#FFF5F5] p-3 rounded-xl border-2 border-[#D6A39F] shadow-sm flex flex-col gap-1 hover-lift">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-[#D6A39F] line-clamp-1">
                                                ⚠️ {c.name}
                                            </span>
                                            <span className="text-[10px] text-[#9A9694] bg-white px-1.5 py-0.5 rounded">
                                                {c.credits}學分
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-[#5E5C5C] flex flex-col gap-0.5 mt-1 font-medium">
                                            <span className="truncate">
                                                {c.professor}
                                            </span>
                                            <span className="text-[#D6A39F]">
                                                {formatCourseTime(c.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#748E95]">
                                <span className="w-2 h-2 rounded-full bg-[#748E95]"></span>
                                已選
                            </h4>
                            <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                {selectedCredits} 學分
                            </span>
                        </div>
                        {selectedCourses.length > 0 ? (
                            <div className="space-y-2">
                                {selectedCourses.map((course, index) => (
                                    <div
                                        key={course.id}
                                        className="animate-fadeIn"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}>
                                        <CourseRow
                                            course={course}
                                            // Check if it's in myPlan to show 'selected', otherwise fall back to local status map
                                            status={
                                                courseStatuses[course.id] ||
                                                "none"
                                            }
                                            onClick={() =>
                                                onCourseClick(course)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[#B0B0B0] text-center py-4 border border-dashed border-[#DCD8D2] rounded-xl">
                                尚無已選課程
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#A3B1C2]">
                                <span className="w-2 h-2 rounded-full bg-[#A3B1C2]"></span>
                                考慮
                            </h4>
                            <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                {consideringCredits} 學分
                            </span>
                        </div>
                        {consideringCourses.length > 0 ? (
                            <div className="space-y-2">
                                {consideringCourses.map((course, index) => (
                                    <div
                                        key={course.id}
                                        className="animate-fadeIn"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}>
                                        <CourseRow
                                            course={course}
                                            // Check if it's in myPlan to show 'selected', otherwise fall back to local status map
                                            status={
                                                courseStatuses[course.id] ||
                                                "none"
                                            }
                                            onClick={() =>
                                                onCourseClick(course)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[#B0B0B0] text-center py-4 border border-dashed border-[#DCD8D2] rounded-xl">
                                尚無考慮課程
                            </div>
                        )}
                    </section>

                    {generalEdCourses.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[#B09E99]">
                                    <span className="w-2 h-2 rounded-full bg-[#B09E99]"></span>
                                    通識
                                </h4>
                                <span className="text-xs font-medium text-[#9A9694] bg-[#EAE7E2] px-2 py-0.5 rounded">
                                    {
                                        generalEdCourses.filter(
                                            (c) =>
                                                courseStatuses[`${c.name}-${c.professor}`] ===
                                                "selected"
                                        ).length
                                    }{" "}
                                    門已選
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {generalEdCourses.map((c) => (
                                    <span
                                        key={c.id}
                                        className={`text-[10px] px-2 py-1 rounded border ${courseStatuses[`${c.name}-${c.professor}`] === "selected" ? "bg-[#B09E99] text-white border-[#B09E99]" : "bg-white text-[#9A9694] border-[#DCD8D2]"}`}>
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Timetable
