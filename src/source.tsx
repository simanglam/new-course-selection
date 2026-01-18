import React, { useState, useEffect, useMemo } from "react"
import { MORANDI_PALETTE, STATUS_CONFIG } from "./const"
import { Course, CourseStatus, CourseType, ViewType } from "./types/course"
import "./index.css"
import CourseModal from "./components/CourseModal"
import CourseRow from "./components/CourseRow"
import Timetable from "./components/TimeTable"
import axios from "axios"

const COLLEGES = [
    {
        "name": "文學院",
        "departments": [
            {
                "name": "文學院學士班",
                "number": "1014"
            },
            {
                "name": "中國文學系",
                "number": "1104"
            },
            {
                "name": "中國文學研究所",
                "number": "1106"
            },
            {
                "name": "外國語文學系",
                "number": "1154"
            },
            {
                "name": "外國語文研究所",
                "number": "1156"
            },
            {
                "name": "歷史學系",
                "number": "1204"
            },
            {
                "name": "歷史研究所",
                "number": "1206"
            },
            {
                "name": "哲學系",
                "number": "1254"
            },
            {
                "name": "哲學研究所",
                "number": "1256"
            },
            {
                "name": "語言學研究所",
                "number": "1306"
            },
            {
                "name": "英語教學研究所",
                "number": "1366"
            },
            {
                "name": "台灣文學與創意應用研究所",
                "number": "1416"
            }
        ]
    },
    {
        "name": "理學院",
        "departments": [
            {
                "name": "理學院學士班",
                "number": "2014"
            },
            {
                "name": "理學院碩博班",
                "number": "2016"
            },
            {
                "name": "數學系",
                "number": "2104"
            },
            {
                "name": "應用數學研究所",
                "number": "2106"
            },
            {
                "name": "地震研究所",
                "number": "2156"
            },
            {
                "name": "物理學系",
                "number": "2204"
            },
            {
                "name": "物理研究所",
                "number": "2206"
            },
            {
                "name": "統計科學研究所",
                "number": "2316"
            },
            {
                "name": "地球與環境科學系",
                "number": "2354"
            },
            {
                "name": "地球與環境科學系碩士班",
                "number": "2386"
            },
            {
                "name": "數學研究所",
                "number": "2406"
            },
            {
                "name": "分子生物研究所",
                "number": "2456"
            },
            {
                "name": "生物醫學研究所",
                "number": "2556"
            },
            {
                "name": "生物醫學科學系",
                "number": "2574"
            },
            {
                "name": "化學暨生物化學系",
                "number": "2604"
            },
            {
                "name": "化學暨生物化學研究所",
                "number": "2606"
            },
            {
                "name": "跨領域科學國際博士學位學程",
                "number": "2708"
            }
        ]
    },
    {
        "name": "社會科學院",
        "departments": [
            {
                "name": "社會福利學系",
                "number": "3104"
            },
            {
                "name": "社會福利研究所",
                "number": "3106"
            },
            {
                "name": "心理學系",
                "number": "3154"
            },
            {
                "name": "心理學研究所",
                "number": "3156"
            },
            {
                "name": "勞工關係學系",
                "number": "3204"
            },
            {
                "name": "勞工研究所",
                "number": "3206"
            },
            {
                "name": "政治學系",
                "number": "3304"
            },
            {
                "name": "政治學研究所",
                "number": "3306"
            },
            {
                "name": "傳播學系",
                "number": "3354"
            },
            {
                "name": "電訊傳播研究所",
                "number": "3356"
            },
            {
                "name": "戰略暨國際事務研究所",
                "number": "3416"
            },
            {
                "name": "臨床心理學研究所",
                "number": "3656"
            },
            {
                "name": "認知科學博士學位學程",
                "number": "3708"
            }
        ]
    },
    {
        "name": "工學院",
        "departments": [
            {
                "name": "工學院學士班",
                "number": "4014"
            },
            {
                "name": "工學院碩博班",
                "number": "4016"
            },
            {
                "name": "資訊工程學系",
                "number": "4104"
            },
            {
                "name": "資訊工程研究所",
                "number": "4106"
            },
            {
                "name": "電機工程學系",
                "number": "4154"
            },
            {
                "name": "電機工程研究所",
                "number": "4156"
            },
            {
                "name": "機械工程研究所",
                "number": "4206"
            },
            {
                "name": "機械工程學系光機電整合工程組",
                "number": "4214"
            },
            {
                "name": "機械工程學系機械工程組",
                "number": "4224"
            },
            {
                "name": "機械工程國際學士學位學程",
                "number": "4234"
            },
            {
                "name": "化學工程學系",
                "number": "4254"
            },
            {
                "name": "化學工程研究所",
                "number": "4256"
            },
            {
                "name": "通訊工程學系",
                "number": "4304"
            },
            {
                "name": "通訊工程研究所",
                "number": "4306"
            },
            {
                "name": "光機電整合工程研究所",
                "number": "4416"
            },
            {
                "name": "前瞻製造系統博士學位學程",
                "number": "4458"
            },
            {
                "name": "前瞻工程全英語碩士學位學程",
                "number": "4466"
            },
            {
                "name": "機械工程學系國際智慧製造碩士專班",
                "number": "4616"
            }
        ]
    },
    {
        "name": "管理學院",
        "departments": [
            {
                "name": "管理學院學士班",
                "number": "5014"
            },
            {
                "name": "管理學院碩博班",
                "number": "5016"
            },
            {
                "name": "經濟學系",
                "number": "5104"
            },
            {
                "name": "國際經濟研究所",
                "number": "5106"
            },
            {
                "name": "財務金融學系",
                "number": "5154"
            },
            {
                "name": "財務金融研究所",
                "number": "5156"
            },
            {
                "name": "企業管理學系",
                "number": "5204"
            },
            {
                "name": "企業管理研究所",
                "number": "5206"
            },
            {
                "name": "會計與資訊科技學系",
                "number": "5264"
            },
            {
                "name": "會計與資訊科技研究所",
                "number": "5266"
            },
            {
                "name": "資訊管理學系",
                "number": "5304"
            },
            {
                "name": "資訊管理研究所",
                "number": "5306"
            },
            {
                "name": "國際財務金融管理碩士學位學程",
                "number": "5356"
            },
            {
                "name": "金融科技碩士學位學程",
                "number": "5406"
            },
            {
                "name": "企業管理學系行銷與數位分析碩士班",
                "number": "5476"
            },
            {
                "name": "醫療資訊管理研究所",
                "number": "5556"
            }
        ]
    },
    {
        "name": "法學院",
        "departments": [
            {
                "name": "法學院學士班",
                "number": "6014"
            },
            {
                "name": "法律學研究所",
                "number": "6056"
            },
            {
                "name": "法律學系法學組",
                "number": "6104"
            },
            {
                "name": "法律學系法制組",
                "number": "6204"
            },
            {
                "name": "財經法律學系",
                "number": "6304"
            },
            {
                "name": "財經法律學研究所",
                "number": "6306"
            }
        ]
    },
    {
        "name": "教育學院",
        "departments": [
            {
                "name": "成人及繼續教育學系",
                "number": "7104"
            },
            {
                "name": "成人及繼續教育研究所",
                "number": "7106"
            },
            {
                "name": "教育學研究所",
                "number": "7156"
            },
            {
                "name": "教育學研究所課程與教學碩士班",
                "number": "7166"
            },
            {
                "name": "教育學研究所課程博士班",
                "number": "7168"
            },
            {
                "name": "犯罪防治學系",
                "number": "7254"
            },
            {
                "name": "犯罪防治研究所",
                "number": "7256"
            },
            {
                "name": "師資培育中心",
                "number": "7306"
            },
            {
                "name": "運動與休閒教育研究所",
                "number": "7356"
            },
            {
                "name": "運動競技學系",
                "number": "7364"
            },
            {
                "name": "教育領導與管理發展國際碩士學位學程",
                "number": "7456"
            },
            {
                "name": "高齡者教育研究所",
                "number": "7506"
            }
        ]
    },
    {
        "name": "其他",
        "departments": [
            {
                "name": "體育中心",
                "number": "F000"
            },
            {
                "name": "通識教育中心",
                "number": "I001"
            },
            {
                "name": "軍訓",
                "number": "V000"
            },
            {
                "name": "語言中心",
                "number": "Z121"
            },
            {
                "name": "紫荊不分系學士學位學程",
                "number": "9104"
            },
            {
                "name": "(專)台灣文學與創意應用研究所台灣文化碩士在職專班",
                "number": "1536"
            },
            {
                "name": "(專)地球與環境科學系災害應變碩士在職專班",
                "number": "2396"
            },
            {
                "name": "(專)政治學系政府與公共事務碩士在職專班",
                "number": "3316"
            },
            {
                "name": "(專)戰略暨國際事務研究所戰略暨國家安全碩士在職專班",
                "number": "3426"
            },
            {
                "name": "(專)雲端計算與物聯網數位學習碩士在職專班",
                "number": "4116"
            },
            {
                "name": "(專)會計與法律數位學習碩士在職專班",
                "number": "5286"
            },
            {
                "name": "(專)高階主管管理碩士在職專班",
                "number": "5656"
            },
            {
                "name": "(專)法學院高階主管法律碩士在職專班",
                "number": "6356"
            },
            {
                "name": "(專)教學專業發展數位學習碩士在職專班",
                "number": "7606"
            },
            {
                "name": "(專)教育專業與學校領導數位學習碩士在職專班",
                "number": "7706"
            }
        ]
    }
]

// --- Helper Functions ---
const getRandomSubset = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count).sort()
}

// --- Generators ---
const generateCourses = async (num: string): Promise<Course[]> => {
    let courses: Course[] = await axios.get<Course[]>(`/courseData/${num}.json`).then(res => res.data)
    
    console.log(courses)
    return courses
}

// --- Components ---

const Sidebar = ({
    selectedDept,
    onSelect,
    currentView
}: {
    selectedDept: string
    onSelect: (dept: string, num: string) => void
    currentView: ViewType
}) => {
    const [expandedCollege, setExpandedCollege] = useState<string | null>(
        
    )
    

    const toggleCollege = (college: string) => {
        setExpandedCollege(expandedCollege === college ? null : college)
    }

    return (
        <aside className="w-72 min-h-screen flex flex-col bg-[#EBE9E4] border-r border-[#DCD8D2] flex-shrink-0 relative z-20 transition-colors duration-300">
            {/* Brand Header */}
            <div className="px-8 py-10 flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold text-[#5E5C5C] tracking-wider font-sans">
                    查課系統
                </h1>
            </div>

            <div className="px-8 pb-2 text-xs font-bold text-[#9A9694] uppercase tracking-wider">
                學院系所
            </div>

            {/* Navigation List */}
            <nav className="flex-1 px-6 pb-6 space-y-4">
                {COLLEGES.map((college) => (
                    <div key={college.name} className="group">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCollege(college.name)}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-colors rounded-lg group-hover:text-[#5E5C5C] ${
                                expandedCollege === college.name
                                    ? "text-[#5E5C5C]"
                                    : "text-[#9A9694]"
                            }`}>
                            <span className="tracking-wide">
                                {college.name}
                            </span>
                            <svg
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                    expandedCollege === college.name
                                        ? "rotate-180 text-[#748E95]"
                                        : "text-[#DCD8D2]"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Sub-menu (Departments) */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedCollege === college.name
                                    ? "max-h-[1000px] opacity-100 mt-1"
                                    : "max-h-0 opacity-0"
                            }`}>
                            <div className="pl-4 space-y-1">
                                {college.departments.map((dept) => (
                                    <button
                                        key={dept.name}
                                        onClick={() => onSelect(dept.name, dept.number)}
                                        className={`block w-full text-left py-2.5 px-5 text-sm rounded-full transition-all duration-300 ease-out relative overflow-hidden ${
                                            selectedDept === dept.name &&
                                            currentView === "lookup"
                                                ? "bg-[#B09E99] text-white shadow-md font-medium translate-x-1"
                                                : "text-[#9A9694] hover:text-[#5E5C5C] hover:bg-[#DCD8D2]/50"
                                        }`}>
                                        {dept.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[#DCD8D2] text-[10px] text-[#B0B0B0] text-center tracking-wider uppercase">
                © 2026 University System
            </div>
        </aside>
    )
}

const App = () => {
    const [selectedDept, setSelectedDept] = useState("文學院學士班")
    const [selectedDeptNum, setSelectedDeptNum] = useState("1014")
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [courseStatuses, setCourseStatuses] = useState<
        Record<string, CourseStatus>
    >({})
    const [searchQuery, setSearchQuery] = useState("")

    // My Plan State
    const [myPlanCourses, setMyPlanCourses] = useState<Course[]>([])
    const [currentView, setCurrentView] = useState<ViewType>("lookup") // 'lookup' or 'plan'

    // Mobile drawer state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const fetchCourses = async () => {
            setCourses(await generateCourses(selectedDeptNum))
        }
        fetchCourses()
        setSearchQuery("")
        setIsMobileMenuOpen(false) // Close mobile menu on selection
    }, [selectedDeptNum])

    // Main Logic: Update tracked courses when status changes
    const handleStatusChange = (course: Course, status: CourseStatus) => {
        // Update visual status map
        setCourseStatuses((prev) => ({ ...prev, [`${course.name}-${course.professor}`]: status }))

        // Sync with My Plan List
        // We add to list if user expresses interest (Selected or Considering)
        if (status === "selected" || status === "considering") {
            setMyPlanCourses((prev) => {
                if (prev.some((c) => `${c.name}-${c.professor}` === `${course.name}-${course.professor}`)) return prev
                return [...prev, course]
            })
        } else {
            // Remove if marked as rejected or none
            setMyPlanCourses((prev) => prev.filter((c) => `${c.name}-${c.professor}` !== `${course.name}-${course.professor}`))
        }
    }

    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return courses
        const lowerQuery = searchQuery.toLowerCase()
        return courses.filter(
            (c) =>
                c.name.toLowerCase().includes(lowerQuery) ||
                c.professor.toLowerCase().includes(lowerQuery)
        )
    }, [courses, searchQuery])

    return (
        <div className="flex min-h-screen bg-[#F2F0EB] font-sans text-[#5E5C5C]">
            {/* Mobile Sidebar Overlay/Drawer */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}></div>
                <div
                    className={`absolute left-0 top-0 bottom-0 w-72 bg-[#EBE9E4] transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <Sidebar
                        selectedDept={selectedDept}
                        onSelect={(dept, num) => {
                            setSelectedDept(dept)
                            setSelectedDeptNum(num)
                            setIsMobileMenuOpen(false)
                        }}
                        currentView={currentView}
                    />
                </div>
            </div>

            {/* Desktop Sidebar (Fixed) */}
            <div
                className={`hidden lg:block w-72 flex-shrink-0 border-r border-[#DCD8D2] bg-[#EBE9E4]`}>
                <Sidebar
                    selectedDept={selectedDept}
                    onSelect={(dept, num) => {
                            setSelectedDept(dept)
                            setSelectedDeptNum(num)
                    }}
                    currentView={currentView}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Main Header with Tabs */}
                <header className="px-8 py-5 border-b border-[#DCD8D2] bg-[#F2F0EB] flex flex-col md:flex-row md:items-center justify-between z-10 flex-shrink-0 gap-4">
                    {/* Top Left Controls */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-[#9A9694]"
                            onClick={() => setIsMobileMenuOpen(true)}>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>

                        {/* View Switcher Tabs */}
                        <div className="bg-[#EBE9E4] p-1 rounded-xl flex items-center">
                            <button
                                onClick={() => setCurrentView("lookup")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    currentView === "lookup"
                                        ? "bg-white text-[#5E5C5C] shadow-sm scale-105"
                                        : "text-[#9A9694] hover:text-[#5E5C5C]"
                                }`}>
                                課程總覽
                            </button>
                            <button
                                onClick={() => setCurrentView("plan")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    currentView === "plan"
                                        ? "bg-white text-[#5E5C5C] shadow-sm scale-105"
                                        : "text-[#9A9694] hover:text-[#5E5C5C]"
                                }`}>
                                我的課表
                            </button>
                        </div>
                    </div>

                    {/* Context Info (Only for Lookup) */}
                    {currentView === "lookup" && (
                        <div className="flex items-center gap-4 flex-1 justify-end animate-fadeSlide">
                            <div className="hidden md:block text-right mr-2">
                                <div className="text-xl font-bold text-[#5E5C5C]">
                                    {selectedDept}
                                </div>
                            </div>
                            {/* Search */}
                            <div className="relative group w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="在此範圍搜尋..."
                                    className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-full bg-[#FDFBF7] border border-[#E0DCD8] text-sm focus:outline-none focus:ring-1 focus:ring-[#748E95] focus:border-[#748E95] md:focus:w-72 transition-all duration-300 placeholder-[#B0B0B0]"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <svg
                                    className="w-5 h-5 text-[#B09E99] absolute left-3 top-2.5 transition-colors group-focus-within:text-[#748E95]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </header>

                {/* Main Body */}
                <main className="flex-1 bg-[#F2F0EB] relative">
                    <div key={currentView} className="h-full animate-fadeSlide">
                        {currentView === "lookup" ? (
                            <div className="p-8">
                                {filteredCourses.length > 0 ? (
                                    <div className="flex flex-col space-y-3 pb-20 max-w-7xl mx-auto">
                                        {filteredCourses.map(
                                            (course, index) => (
                                                <div
                                                    key={index}
                                                    className="animate-fadeIn"
                                                    style={{
                                                        animationDelay: `${index * 50}ms`
                                                    }}>
                                                    <CourseRow
                                                        course={course}
                                                        // Check if it's in myPlan to show 'selected', otherwise fall back to local status map
                                                        status={
                                                            courseStatuses[
                                                                `${course.name}-${course.professor}`
                                                            ] || "none"
                                                        }
                                                        onClick={() =>
                                                            setSelectedCourse(
                                                                course
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-[#9A9694] pb-20 mt-20">
                                        <div className="w-16 h-16 rounded-full bg-[#EBE9E4] flex items-center justify-center mb-4">
                                            <svg
                                                className="w-8 h-8 text-[#DCD8D2]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-[#5E5C5C]">
                                            沒有找到相關課程
                                        </p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="mt-6 px-6 py-2 bg-[#FDFBF7] border border-[#E0DCD8] rounded-full text-sm hover:border-[#748E95] hover:text-[#748E95] transition-colors">
                                            清除搜尋
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full">
                                <Timetable
                                    myCourses={myPlanCourses}
                                    courseStatuses={courseStatuses}
                                    selectedDept={selectedDept}
                                    onCourseClick={(course) =>
                                        setSelectedCourse(course)
                                    }
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <CourseModal
                course={selectedCourse}
                isOpen={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
                status={
                    selectedCourse
                        ? courseStatuses[`${selectedCourse.name}-${selectedCourse.professor}`] || "none"
                        : "none"
                }
                onStatusChange={(status) => {
                    if (selectedCourse) {
                        handleStatusChange(selectedCourse, status)
                    }
                }}
            />
        </div>
    )
}

export default App
