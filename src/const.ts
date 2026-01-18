export const MORANDI_PALETTE = {
    bg: "#F2F0EB", // Deep Warm Beige for main background
    sidebar: "#EBE9E4", // Slightly darker warm grey/beige for sidebar
    header: "#F2F0EB", // Matching main bg
    card: "#FDFBF7", // Cream/Off-white (NOT pure white) for cards
    modal: "#FDFBF7", // Cream for modal
    textPrimary: "#5E5C5C", // Softer dark grey
    textSecondary: "#9A9694", // Warm grey
    accent1: "#748E95", // Muted Teal (Primary)
    accent2: "#B09E99", // Muted Rose (Secondary)
    accent3: "#9BA69C", // Sage Green (Success)
    accent4: "#A3B1C2", // Serenity Blue (Info)
    accent5: "#D6A39F", // Soft Red (Warning)
    accent6: "#Cacaca", // Neutral Grey (Disabled)
    border: "#E0DCD8", // Soft border
    hover: "#EAE7E2", // Hover state
    sectionBg: "#F5F4F0" // Slightly darker than card for inner sections
}

export const STATUS_CONFIG = {
    selected: {
        label: "已選",
        color: MORANDI_PALETTE.accent3,
        textColor: "#fff"
    },
    considering: {
        label: "考慮",
        color: MORANDI_PALETTE.accent4,
        textColor: "#fff"
    },
    conflict: {
        label: "衝堂",
        color: MORANDI_PALETTE.accent5,
        textColor: "#fff"
    },
    rejected: {
        label: "不選",
        color: MORANDI_PALETTE.accent6,
        textColor: "#fff"
    }
}
