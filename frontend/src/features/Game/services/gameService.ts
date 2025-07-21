// Yoklama kaydetme servisi
import { API_URL } from '../../../config';

interface AttendanceSaveItem {
    student_id: number;
    morning_status: number; // 0: geldi, 1: geç, 2: gelmedi, 3: izinli
    afternoon_status: number; // 0: geldi, 1: geç, 2: gelmedi, 3: izinli
}

export async function saveBulkAttendance(
    date: string,
    attendances: AttendanceSaveItem[],
    token: string
): Promise<any> {
    const res = await fetch(`${API_URL}/attendance/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, attendances }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Yoklama kaydedilemedi');
    return data;
}

// Belirli bir tarih ve sınıf için yoklama kayıtlarını çek
export async function fetchAttendanceByDateAndClass(date: string, grade: string, token: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/attendance/by-date-class?date=${date}&grade=${encodeURIComponent(grade)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Yoklama kayıtları alınamadı');
    return await res.json();
}

// // Belirli bir tarihten önce o sınıf için yoklama var mı?
// export async function checkAnyAttendanceBefore(date: string, grade: string, token: string): Promise<boolean> {
//     const res = await fetch(`${API_URL}/attendance/any-before?date=${date}&grade=${encodeURIComponent(grade)}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     if (!res.ok) return false;
//     const data = await res.json();
//     return !!data.exists;
// }
