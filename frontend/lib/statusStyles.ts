export function getStatusStyles(status: string) {
    switch ( status ) {
        case "RESOLVED":
            return "bg-green-100 text-green-700";
        case "ESCALATED":
            return "bg-red-100 text-red-700";
        case "DISPUTED":
            return"bg-yellow-100 text-yellow-900";
        case "FOLLOW_UP_SCHEDULED":
            return "bg-blue-100 text-blue-700";
        case "PROMISE_TO_PAY":
            return "bg-purple-100 text-purple-700";
        
            default:
                return "bg-gray-100 text-gray-700";
    }
}