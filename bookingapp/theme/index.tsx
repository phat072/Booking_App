// Define the interface for color objects in the palette
interface Color {
    text: string;
    bgColor: (opacity: number) => string; // Function that takes an opacity number and returns a string
}

// Define the color palette
const palette: Color[] = [
    {   // orange
        text: '#f97316', 
        bgColor: (opacity: number) => `rgba(251, 146, 60, ${opacity})`
    },
    {   // dark gray
        text: '#334155', 
        bgColor: (opacity: number) => `rgba(30, 41, 59, ${opacity})`,
    },
    {   // purple
        text: '#7c3aed', 
        bgColor: (opacity: number) => `rgba(167, 139, 250, ${opacity})`,
    },
    {   // green
        text: '#009950', 
        bgColor: (opacity: number) => `rgba(0, 179, 89, ${opacity})`,
    },
    {
        // teal
        text: '#14b8a6',
        bgColor: (opacity: number) => `rgba(45, 212, 191, ${opacity})`
    },
    {
        // red
        text: '#dc2626',
        bgColor: (opacity: number) => `rgba(248, 113, 113, ${opacity})`
    }
];

// Define the theme colors using the first color from the palette
export const themeColors: Color = {
    ...palette[0]
};

// Define additional colors
export const colors = {
    DARK: '#000000',
    BLUE: '#3F91F2',
    GRAY: '#F2F2F2',
    PINK: '#F184C3',
    PRIMARY: '#E67205',
    SECONDARY: '#1E1CDB',
    DARKGRAY: '#757575',
};
