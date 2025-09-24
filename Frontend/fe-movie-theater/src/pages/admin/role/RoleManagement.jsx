import React, { useEffect, useState } from 'react'
import { handleApiRequest } from '../../../utils/ApiHandler';
import RoleApi from '../../../api/RoleApi';
import PermissionApi from '../../../api/PermissionApi';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Switch, TextField, Typography } from '@mui/material';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "../../../components/ui/table";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Access from '../../../utils/Access'
import {formatDateToDDMMYYYHHMMSS } from "../../../utils/DateFormat";
const RoleManagement = () => {
    const [listRole, setListRole] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newRole, setNewRole] = useState({ roleId: '', roleName: '', description: '' });
    // const [selectedId, setSelectedId] = useState();
    const [permissions, setPermissions] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState([])


    // const [permissions, setPermissions] = useState([
    //     { category: "USERS", enabled: false, subPermissions: [{ name: "Create User", method: "POST", endpoint: "/api/v1/users", enabled: false }] },
    //     { category: "RESUMES", enabled: false, subPermissions: [{ name: "View Resumes", method: "GET", endpoint: "/api/v1/resumes", enabled: false }] }
    // ]);

    useEffect(() => {
        fetchAllListRole();
        fetchAllListPermissionDto();
    }, [])

    const fetchAllListRole = async () => {
        await handleApiRequest({
            apiCall: () => RoleApi.listRole(),
            onSuccess: (res) => {
                setListRole(res.data);
            },
            showSuccessToast: false
        })
    };
    const fetchAllListPermissionDto = async () => {
        await handleApiRequest({
            apiCall: () => PermissionApi.listPermissionDto(),
            onSuccess: (res) => {
                setPermissions(res.data);
            },
            showSuccessToast: false
        })
    };

    const handleDetailRole = async (st) => {
        setOpenDetailDialog(true);
        setSelectedRole(st);
    };

    const handleOpenEdit = (role) => {
        setOpen(true);
        // setSelectedId(role.roleId);
        let selectedId = role.roleId;
        setNewRole(role);
        setSelectedPermission(listRole.find(r => r.roleId === selectedId)?.permissions?.map(p => p.id))
    }

    const handleModuleChange = (index) => {
        setPermissions(prevPermissions => {
            return prevPermissions?.map((perm, i) => {
                if (i === index) {
                    const allSubPermissionsSelected = perm?.permissionModules?.every(sp =>
                        selectedPermission?.includes(sp.id)
                    );

                    let updatedSelectedPermissions;
                    if (allSubPermissionsSelected) {
                        // Nếu tất cả subPermissions đang được chọn, bỏ chọn toàn bộ
                        updatedSelectedPermissions = selectedPermission?.filter(id =>
                            !perm?.permissionModules?.some(sp => sp.id === id)
                        );
                    } else {
                        // Nếu có ít nhất một subPermission chưa được chọn, chọn tất cả
                        const newPermissions = perm?.permissionModules
                            ?.map(sp => sp.id) || [];

                        updatedSelectedPermissions = [...new Set([...selectedPermission, ...newPermissions])];
                    }

                    setSelectedPermission(updatedSelectedPermissions);

                    return {
                        ...perm,
                        enabled: !allSubPermissionsSelected // Nếu tất cả đã chọn thì bỏ chọn, ngược lại chọn tất cả
                    };
                }
                return perm;
            }) || [];
        });
    };

    const handleSubPermissionChange = (moduleIndex, subPermId) => {
        setSelectedPermission(prevSelected => {
            const isSelected = prevSelected?.includes(subPermId);
            return isSelected
                ? prevSelected?.filter(id => id !== subPermId)  // Nếu đã chọn, bỏ ra khỏi danh sách
                : [...prevSelected, subPermId];  // Nếu chưa chọn, thêm vào danh sách
        });

        // Kiểm tra nếu tất cả subPermissions của module đã được chọn
        setPermissions(prevPermissions => {
            return prevPermissions?.map((perm, i) => {
                if (i === moduleIndex) {
                    const allSelected = perm?.permissionModules?.every(sp =>
                        selectedPermission?.includes(sp.id) || sp.id === subPermId
                    );
                    return { ...perm, enabled: allSelected };
                }
                return perm;
            });
        });
    };


    const handleSubmit = async () => {
        await handleApiRequest({
            apiCall: () => RoleApi.updateRole(newRole.roleId, selectedPermission),
            onSuccess: () => {
                fetchAllListRole();
                setOpen(false);
            },
            successMessage: "Set permissions successfully"
        });
    };

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ padding: "70px" }}>
                    {/* Role Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listRole.length > 0 ? (
                                    listRole.map((st) => (
                                        <TableRow key={st.roleId}>
                                            <TableCell>{st.roleId}</TableCell>
                                            <TableCell>{st.roleName}</TableCell>
                                            <TableCell>{st.description}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small" onClick={() => handleDetailRole(st)}>
                                                    Detail
                                                </Button>
                                                <Access permission={{ method: "PUT", apiPath: "/api/v1/role/{id}", module: "Role" }} hideChildren>
                                                    <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(st)}>
                                                        Permission
                                                    </Button>
                                                </Access>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "20px" }}
                                        >
                                            No role found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Set permission Role Dialog */}
                    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Permission</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Name"
                                name="roleName"
                                fullWidth
                                margin="dense"
                                value={newRole.roleName || ""}
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                margin="dense"
                                value={newRole.description || ""}
                                InputProps={{ readOnly: true }}
                            />

                            {/* Quyền hạn (Permissions) */}
                            <Box mt={2} p={2} borderRadius={2} border="1px solid #ddd" bgcolor="#fafafa">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Permission
                                </Typography>
                                <Divider sx={{ my: 1 }} />

                                {permissions?.map((perm, index) => (
                                    <Accordion key={index} elevation={0} sx={{ backgroundColor: "#fff", boxShadow: "none", border: "1px solid #ddd", borderRadius: "8px", mb: 1 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{perm?.module}</Typography>
                                            <Switch
                                                checked={perm?.permissionModules?.every(sp => selectedPermission?.includes(sp.id)) ?? false}
                                                onChange={() => handleModuleChange(index)}
                                            />

                                        </AccordionSummary>

                                        <AccordionDetails>
                                            {perm?.permissionModules?.map((subPerm) => (
                                                <Box key={subPerm?.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 1 }}>
                                                    <Typography>{subPerm?.name}</Typography>
                                                    <Typography sx={{ color: "gray", ml: 3 }}>{subPerm?.method}</Typography>
                                                    <Typography sx={{ color: "gray", flexGrow: 1, textAlign: "right" }}>{subPerm?.apiPath}</Typography>
                                                    <Switch
                                                        checked={selectedPermission?.includes(subPerm?.id) ?? false}
                                                        onChange={() => handleSubPermissionChange(index, subPerm?.id)}
                                                    />

                                                </Box>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleSubmit} color="primary" variant="contained">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Role Detail Dialog */}
                    <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
                        <DialogTitle>Role Details</DialogTitle>
                        <DialogContent>
                            {selectedRole && (
                                <>
                                    <TextField
                                        label="Create By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedRole.createdBy ? selectedRole.createdBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedRole.createdAt ? formatDateToDDMMYYYHHMMSS(selectedRole.createdAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedRole.updatedBy ? selectedRole.updatedBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedRole.updatedAt ? formatDateToDDMMYYYHHMMSS(selectedRole.updatedAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetailDialog(false)} color="secondary">Close</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default RoleManagement