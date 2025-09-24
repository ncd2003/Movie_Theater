import RoleApi from "../api/RoleApi";

const DB_NAME = "Movie_Theater";
const STORE_NAME = "Permissions";

// 🔹 Hàm mở IndexedDB
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 🔹 Hàm lấy danh sách từ IndexedDB
export async function getObj() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // console.log("📂 Dữ liệu từ IndexedDB:", request.result);
            resolve(request.result);
        };
        request.onerror = () => reject("❌ Không thể lấy dữ liệu từ IndexedDB!");
    });
}

// 🔹 Hàm lưu danh sách vào IndexedDB
export async function saveList(obj) {
    if (!obj) {
        // console.log("⚠️ Không có dữ liệu để lưu vào IndexedDB!");
        return;
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        store.add(obj)

        transaction.oncomplete = () => {
            // console.log("✅ Dữ liệu đã được lưu vào IndexedDB!");
            resolve();
        };
        transaction.onerror = () => reject("❌ Lỗi khi lưu vào IndexedDB!");
    });
}

// 🔹 Kiểm tra & lưu danh sách nếu chưa có
export async function saveListIfEmpty() {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count(); // Đếm số lượng record

    return new Promise((resolve, reject) => {
        request.onsuccess = async () => {
            if (request.result === 0) {
                // console.log("⚠️ IndexedDB trống, đang tải dữ liệu từ API...");
                const roleId = localStorage?.getItem("roleId");
                // console.log("Role id ", roleId);
                if (roleId) {
                    const sampleList = (await RoleApi.fetchPermissionRoleById(roleId))?.data;
                    //console.log("📡 Dữ liệu từ API:", sampleList);

                    if (sampleList) {
                        await saveList(sampleList);
                        resolve("Dữ liệu đã được thêm vào IndexedDB!");
                    } else {
                        // console.log("⚠️ API không trả về dữ liệu, không thể lưu vào IndexedDB!");
                        resolve("Không có dữ liệu mới.");
                    }
                }

            } else {
                // console.log("✅ Dữ liệu đã tồn tại trong IndexedDB, không cần lưu lại.");
                resolve("Dữ liệu đã tồn tại.");
            }
        };
        request.onerror = () => reject("❌ Không thể kiểm tra dữ liệu trong IndexedDB!");
    });
}

// 🔹 Xóa toàn bộ dữ liệu trong IndexedDB
export async function clearPermissions() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            // console.log("🗑️ Đã xóa toàn bộ dữ liệu trong IndexedDB!");
            resolve("✅ Dữ liệu đã được xóa!");
        };

        clearRequest.onerror = () => reject("❌ Lỗi khi xóa dữ liệu trong IndexedDB!");
    });
}

