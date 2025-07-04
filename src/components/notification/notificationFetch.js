export const randomNumber = Math.floor(Math.random() * 358) + 1;

export async function notificationResponse(params) {
    const value = randomNumber
    const res = await fetch(`/api/bns/search?search=${encodeURIComponent(`${value}`)}&lang=${'hi'}`)
        const data = await res.json();
        // console.log(data.bns[0])
        if (!data) return {}
        return data.bns[0]
} 