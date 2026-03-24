import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  GraduationCap,
  User,
  Bell,
  Check,
  X,
  Edit,
  Save,
} from "lucide-react";
import { useState } from "react";

// Types
interface Role {
  id: "admin" | "teacher" | "student" | "parent";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  users: number;
  iconColor: string;
}

interface Permission {
  name: string;
  admin: boolean;
  teacher: boolean;
  student: boolean;
  parent: boolean;
}

// Constants
const ROLES: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    icon: Shield,
    color: "bg-blue-600",
    users: 3,
    iconColor: "text-blue-600",
  },
  {
    id: "teacher",
    name: "Teacher",
    icon: GraduationCap,
    color: "bg-green-600",
    users: 48,
    iconColor: "text-green-600",
  },
  {
    id: "student",
    name: "Student",
    icon: User,
    color: "bg-orange-600",
    users: 524,
    iconColor: "text-orange-600",
  },
  {
    id: "parent",
    name: "Parent",
    icon: Users,
    color: "bg-purple-600",
    users: 412,
    iconColor: "text-purple-600",
  },
];

const INITIAL_PERMISSIONS: Permission[] = [
  {
    name: "View Dashboard",
    admin: true,
    teacher: true,
    student: true,
    parent: true,
  },
  {
    name: "Manage Students",
    admin: true,
    teacher: false,
    student: false,
    parent: false,
  },
  {
    name: "Manage Teachers",
    admin: true,
    teacher: false,
    student: false,
    parent: false,
  },
  {
    name: "View Reports",
    admin: true,
    teacher: true,
    student: false,
    parent: true,
  },
  {
    name: "Create Announcements",
    admin: true,
    teacher: true,
    student: false,
    parent: false,
  },
  {
    name: "Mark Attendance",
    admin: true,
    teacher: true,
    student: false,
    parent: false,
  },
  {
    name: "Enter Grades",
    admin: true,
    teacher: true,
    student: false,
    parent: false,
  },
  {
    name: "View Grades",
    admin: true,
    teacher: true,
    student: true,
    parent: true,
  },
  {
    name: "Manage Fees",
    admin: true,
    teacher: false,
    student: false,
    parent: false,
  },
  {
    name: "View Fee Status",
    admin: true,
    teacher: false,
    student: true,
    parent: true,
  },
  {
    name: "Pay Fees Online",
    admin: false,
    teacher: false,
    student: false,
    parent: true,
  },
  {
    name: "Upload Assignments",
    admin: true,
    teacher: true,
    student: false,
    parent: false,
  },
  {
    name: "Submit Assignments",
    admin: false,
    teacher: false,
    student: true,
    parent: false,
  },
  {
    name: "View Timetable",
    admin: true,
    teacher: true,
    student: true,
    parent: true,
  },
  {
    name: "Manage Timetable",
    admin: true,
    teacher: false,
    student: false,
    parent: false,
  },
  {
    name: "Send Messages",
    admin: true,
    teacher: true,
    student: true,
    parent: true,
  },
  {
    name: "View Gallery",
    admin: true,
    teacher: true,
    student: true,
    parent: true,
  },
  {
    name: "Manage Gallery",
    admin: true,
    teacher: false,
    student: false,
    parent: false,
  },
];

const ROLE_COLORS: Record<string, { bg: string; text: string; badge: string }> =
  {
    admin: { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-600" },
    teacher: {
      bg: "bg-green-100",
      text: "text-green-600",
      badge: "bg-green-600",
    },
    student: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      badge: "bg-orange-600",
    },
    parent: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      badge: "bg-purple-600",
    },
  };

// Components
const PageHeader = () => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">Role & Permissions</h1>
          <p className="text-xs text-slate-600">Manage system access control</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </Button>
        <Link to="/portal/admin">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-700 hover:bg-slate-100"
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

interface RoleCardProps {
  role: Role;
  index: number;
}

const RoleCard = ({ role, index }: RoleCardProps) => {
  const Icon = role.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    >
      <div
        className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{role.name}</h3>
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{role.users}</span>{" "}
        active users
      </p>
    </motion.div>
  );
};

interface PermissionCheckboxProps {
  roleId: string;
  isEnabled: boolean;
  onToggle: () => void;
  isEditing?: boolean;
}

const PermissionCheckbox = ({
  roleId,
  isEnabled,
  onToggle,
  isEditing = false,
}: PermissionCheckboxProps) => {
  const colors = ROLE_COLORS[roleId];
  const sizeClasses = isEditing ? "w-10 h-10" : "w-8 h-8";
  const iconSize = isEditing ? "w-5 h-5" : "w-4 h-4";

  if (!isEditing && !isEnabled) {
    return (
      <div
        className={`inline-flex items-center justify-center ${sizeClasses} rounded-lg bg-slate-100`}
      >
        <X className={`${iconSize} text-slate-400`} />
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      disabled={!isEditing}
      className={`inline-flex items-center justify-center ${sizeClasses} rounded-lg transition-all ${
        isEnabled
          ? `${colors.bg} ${colors.text} ${
              isEditing ? "hover:brightness-95 cursor-pointer" : ""
            }`
          : `bg-slate-100 text-slate-400 ${
              isEditing ? "hover:bg-slate-200 cursor-pointer" : ""
            }`
      }`}
    >
      {isEnabled ? (
        <Check className={`${iconSize} font-semibold`} />
      ) : (
        <X className={iconSize} />
      )}
    </button>
  );
};

interface TableHeaderCellProps {
  role: Role;
}

const TableHeaderCell = ({ role }: TableHeaderCellProps) => {
  const Icon = role.icon;
  return (
    <th className="text-center py-4 px-6 font-semibold text-slate-900">
      <div className="flex flex-col items-center gap-2">
        <div className={`p-2 rounded-lg ${role.color}/10`}>
          <Icon className={`w-5 h-5 ${role.iconColor}`} />
        </div>
        <span className="text-xs font-medium text-slate-700">{role.name}</span>
      </div>
    </th>
  );
};

interface PermissionRowProps {
  permission: Permission;
  index: number;
  isEditing?: boolean;
  onToggle?: (permissionName: string, roleId: string) => void;
}

const PermissionRow = ({
  permission,
  index,
  isEditing = false,
  onToggle,
}: PermissionRowProps) => (
  <tr
    className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${
      index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
    }`}
  >
    <td className="py-4 px-6 font-medium text-slate-900 w-48">
      {permission.name}
    </td>
    {ROLES.map((role) => (
      <td key={role.id} className="py-4 px-6 text-center">
        <PermissionCheckbox
          roleId={role.id}
          isEnabled={permission[role.id as keyof Permission] as boolean}
          onToggle={() => onToggle?.(permission.name, role.id)}
          isEditing={isEditing}
        />
      </td>
    ))}
  </tr>
);

interface PermissionsTableProps {
  permissions: Permission[];
  isEditing?: boolean;
  onToggle?: (permissionName: string, roleId: string) => void;
}

const PermissionsTable = ({
  permissions,
  isEditing = false,
  onToggle,
}: PermissionsTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          <th className="text-left py-4 px-6 font-semibold text-slate-900 w-48">
            Permission
          </th>
          {ROLES.map((role) => (
            <TableHeaderCell key={role.id} role={role} />
          ))}
        </tr>
      </thead>
      <tbody>
        {permissions.map((perm, idx) => (
          <PermissionRow
            key={perm.name}
            permission={perm}
            index={idx}
            isEditing={isEditing}
            onToggle={onToggle}
          />
        ))}
      </tbody>
    </table>
  </div>
);

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
  onToggle: (permissionName: string, roleId: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditDialog = ({
  open,
  onOpenChange,
  permissions,
  onToggle,
  onSave,
  onCancel,
}: EditDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg transition-shadow text-white">
        <Edit className="w-4 h-4" />
        Edit Permissions
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-slate-50 -m-6 mb-6 p-6 rounded-t-2xl border-b border-slate-200">
        <DialogTitle className="text-2xl font-bold text-slate-900">
          Edit Role Permissions
        </DialogTitle>
        <p className="text-sm text-slate-600 mt-2">
          Click on each permission cell to toggle access for that role
        </p>
      </DialogHeader>
      <PermissionsTable
        permissions={permissions}
        isEditing={true}
        onToggle={onToggle}
      />
      <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Save className="w-4 h-4" />
          Save Permissions
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Main Component
const RolePermissions = () => {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [editingPermissions, setEditingPermissions] =
    useState(INITIAL_PERMISSIONS);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const togglePermission = (permissionName: string, roleId: string) => {
    setEditingPermissions((prev) =>
      prev.map((perm) =>
        perm.name === permissionName
          ? { ...perm, [roleId]: !perm[roleId as keyof Permission] }
          : perm
      )
    );
  };

  const handleSavePermissions = () => {
    setPermissions(editingPermissions);
    setIsEditDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingPermissions(permissions);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20">
      <PageHeader />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Access Control Management
            </h2>
            <p className="text-slate-600">
              Define and manage permissions for each user role in the system
            </p>
          </div>

          {/* Roles Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {ROLES.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i} />
            ))}
          </div>

          {/* Permissions Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  Permissions Matrix
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Configure permissions for each role in the system
                </p>
              </div>
              <EditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                permissions={editingPermissions}
                onToggle={togglePermission}
                onSave={handleSavePermissions}
                onCancel={handleCancelEdit}
              />
            </div>
            <PermissionsTable permissions={permissions} isEditing={false} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RolePermissions;
