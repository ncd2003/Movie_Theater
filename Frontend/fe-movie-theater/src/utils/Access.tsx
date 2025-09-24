import { useEffect, useState } from "react";
import { getObj } from "./indexedDBService";
import React from "react";

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: { method: string, apiPath: string, module: string };
}

const Access = (props: IProps) => {
    const { permission, hideChildren = false, children } = props;
    const [allow, setAllow] = useState<boolean>(false);
    const [permissions, setPermissions] = useState([{ method: '', apiPath: '', module: '' }]);

    // 🔹 Lấy dữ liệu từ IndexedDB
    useEffect(() => {
        async function getPermissions() {
            try {
                const res = await getObj(); // Lấy dữ liệu từ IndexedDB
                setPermissions(res[0].permissions);
                // console.log(permissions)
            } catch (error) {
                console.error("Lỗi khi lấy permissions:", error);
            }
        }

        getPermissions();
    }, []); // Chạy 1 lần khi component mount

    // 🔹 Kiểm tra quyền sau khi permissions thay đổi
    useEffect(() => {
        if (permissions?.length > 0) {
            // 🔹 Kiểm tra xem quyền có tồn tại không
            const hasPermission = permissions.some(fmp =>
                fmp.method === permission.method &&
                fmp.apiPath === permission.apiPath &&
                fmp.module === permission.module
            );

            setAllow(hasPermission);
            // console.log(hasPermission)
            // // console.log("permissions " +permissions[0])
            // console.log(permission.method + " - " + permission.apiPath + " - " + permission.module)
        }
    }, [permissions, permission]); // Chạy lại khi permissions hoặc permission thay đổi

    return allow ? <>{children}</> : hideChildren ? null : <div>Không có quyền truy cập</div>;
};

export default Access;