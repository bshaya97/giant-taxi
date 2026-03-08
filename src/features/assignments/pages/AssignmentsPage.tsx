import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';
import {
  useDriverVehicleAssignments,
  useCreateDriverVehicleAssignment,
  useCloseDriverVehicleAssignment,
  usePublicRightVehicleAssignments,
  useCreatePublicRightVehicleAssignment,
  useClosePublicRightVehicleAssignment,
  usePublicRightRenterAssignments,
  useCreatePublicRightRenterAssignment,
  useClosePublicRightRenterAssignment,
} from '../hooks/useAssignments';
import { DriverVehicleAssignmentForm } from '../components/DriverVehicleAssignmentForm';
import { PublicRightVehicleAssignmentForm } from '../components/PublicRightVehicleAssignmentForm';
import { PublicRightRenterAssignmentForm } from '../components/PublicRightRenterAssignmentForm';
import { CloseAssignmentDialog } from '../components/CloseAssignmentDialog';
import { AssignmentTable } from '../components/AssignmentTable';
import type {
  DriverVehicleAssignmentWithNames,
  PublicRightVehicleAssignmentWithNames,
  PublicRightRenterAssignmentWithNames,
} from '../types';
import type { CloseAssignmentFormData } from '../schemas/assignmentSchema';

type TabType = 'driverVehicle' | 'publicRightVehicle' | 'publicRightRenter';

export function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('driverVehicle');

  // Driver ↔ Vehicle
  const {
    data: driverVehicleAssignments = [],
    isLoading: dvLoading,
    error: dvError,
  } = useDriverVehicleAssignments();
  const createDVAssignment = useCreateDriverVehicleAssignment();
  const closeDVAssignment = useCloseDriverVehicleAssignment();
  const [isDVFormOpen, setIsDVFormOpen] = useState(false);
  const [closingDVAssignment, setClosingDVAssignment] =
    useState<DriverVehicleAssignmentWithNames | null>(null);

  // Public Right ↔ Vehicle
  const {
    data: publicRightVehicleAssignments = [],
    isLoading: prvLoading,
    error: prvError,
  } = usePublicRightVehicleAssignments();
  const createPRVAssignment = useCreatePublicRightVehicleAssignment();
  const closePRVAssignment = useClosePublicRightVehicleAssignment();
  const [isPRVFormOpen, setIsPRVFormOpen] = useState(false);
  const [closingPRVAssignment, setClosingPRVAssignment] =
    useState<PublicRightVehicleAssignmentWithNames | null>(null);

  // Public Right ↔ Renter
  const {
    data: publicRightRenterAssignments = [],
    isLoading: prrLoading,
    error: prrError,
  } = usePublicRightRenterAssignments();
  const createPRRAssignment = useCreatePublicRightRenterAssignment();
  const closePRRAssignment = useClosePublicRightRenterAssignment();
  const [isPRRFormOpen, setIsPRRFormOpen] = useState(false);
  const [closingPRRAssignment, setClosingPRRAssignment] =
    useState<PublicRightRenterAssignmentWithNames | null>(null);

  // ============================================================
  // Driver ↔ Vehicle Handlers
  // ============================================================

  const handleDVFormSubmit = (data: any) => {
    createDVAssignment.mutate(
      {
        ...data,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          setIsDVFormOpen(false);
          toast.success('השיוך נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת השיוך'),
      },
    );
  };

  const handleCloseDVAssignment = (formData: CloseAssignmentFormData) => {
    if (!closingDVAssignment) return;
    closeDVAssignment.mutate(
      { id: closingDVAssignment.id, end_date: formData.end_date },
      {
        onSuccess: () => {
          setClosingDVAssignment(null);
          toast.success('השיוך סגור בהצלחה');
        },
        onError: () => toast.error('שגיאה בסגירת השיוך'),
      },
    );
  };

  // ============================================================
  // Public Right ↔ Vehicle Handlers
  // ============================================================

  const handlePRVFormSubmit = (data: any) => {
    createPRVAssignment.mutate(
      {
        ...data,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          setIsPRVFormOpen(false);
          toast.success('השיוך נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת השיוך'),
      },
    );
  };

  const handleClosePRVAssignment = (formData: CloseAssignmentFormData) => {
    if (!closingPRVAssignment) return;
    closePRVAssignment.mutate(
      { id: closingPRVAssignment.id, end_date: formData.end_date },
      {
        onSuccess: () => {
          setClosingPRVAssignment(null);
          toast.success('השיוך סגור בהצלחה');
        },
        onError: () => toast.error('שגיאה בסגירת השיוך'),
      },
    );
  };

  // ============================================================
  // Public Right ↔ Renter Handlers
  // ============================================================

  const handlePRRFormSubmit = (data: any) => {
    createPRRAssignment.mutate(
      {
        ...data,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          setIsPRRFormOpen(false);
          toast.success('השיוך נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת השיוך'),
      },
    );
  };

  const handleClosePRRAssignment = (formData: CloseAssignmentFormData) => {
    if (!closingPRRAssignment) return;
    closePRRAssignment.mutate(
      { id: closingPRRAssignment.id, end_date: formData.end_date },
      {
        onSuccess: () => {
          setClosingPRRAssignment(null);
          toast.success('השיוך סגור בהצלחה');
        },
        onError: () => toast.error('שגיאה בסגירת השיוך'),
      },
    );
  };

  return (
    <div>
      <PageHeader title={he.assignments.title} />

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('driverVehicle')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'driverVehicle'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {he.assignments.driverVehicle}
        </button>
        <button
          onClick={() => setActiveTab('publicRightVehicle')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'publicRightVehicle'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {he.assignments.publicRightVehicle}
        </button>
        <button
          onClick={() => setActiveTab('publicRightRenter')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'publicRightRenter'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {he.assignments.publicRightRenter}
        </button>
      </div>

      {/* Driver ↔ Vehicle Tab */}
      {activeTab === 'driverVehicle' && (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setIsDVFormOpen(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {he.common.create}
            </button>
          </div>
          <AssignmentTable
            data={driverVehicleAssignments}
            isLoading={dvLoading}
            error={dvError}
            columns={[
              {
                key: 'driver_id',
                header: he.nav.drivers,
                cell: (row: any) => row.drivers?.full_name || '—',
              },
              {
                key: 'vehicle_id',
                header: he.nav.vehicles,
                cell: (row: any) => row.vehicles?.license_plate || '—',
              },
              { key: 'start_date', header: he.assignments.startDate },
              { key: 'end_date', header: he.assignments.endDate },
            ]}
            onClose={setClosingDVAssignment}
            getStatusText={(isActive) => (isActive ? he.assignments.active : he.assignments.closed)}
          />
        </div>
      )}

      {/* Public Right ↔ Vehicle Tab */}
      {activeTab === 'publicRightVehicle' && (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setIsPRVFormOpen(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {he.common.create}
            </button>
          </div>
          <AssignmentTable
            data={publicRightVehicleAssignments}
            isLoading={prvLoading}
            error={prvError}
            columns={[
              {
                key: 'public_right_id',
                header: he.nav.publicRights,
                cell: (row: any) => row.public_rights?.right_number || '—',
              },
              {
                key: 'vehicle_id',
                header: he.nav.vehicles,
                cell: (row: any) => row.vehicles?.license_plate || '—',
              },
              { key: 'start_date', header: he.assignments.startDate },
              { key: 'end_date', header: he.assignments.endDate },
            ]}
            onClose={setClosingPRVAssignment}
            getStatusText={(isActive) => (isActive ? he.assignments.active : he.assignments.closed)}
          />
        </div>
      )}

      {/* Public Right ↔ Renter Tab */}
      {activeTab === 'publicRightRenter' && (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setIsPRRFormOpen(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {he.common.create}
            </button>
          </div>
          <AssignmentTable
            data={publicRightRenterAssignments}
            isLoading={prrLoading}
            error={prrError}
            columns={[
              {
                key: 'public_right_id',
                header: he.nav.publicRights,
                cell: (row: any) => row.public_rights?.right_number || '—',
              },
              {
                key: 'renter_id',
                header: he.nav.renters,
                cell: (row: any) => row.public_right_renters?.full_name || '—',
              },
              { key: 'start_date', header: he.assignments.startDate },
              { key: 'end_date', header: he.assignments.endDate },
            ]}
            onClose={setClosingPRRAssignment}
            getStatusText={(isActive) => (isActive ? he.assignments.active : he.assignments.closed)}
          />
        </div>
      )}

      {/* Forms */}
      <DriverVehicleAssignmentForm
        isOpen={isDVFormOpen}
        onClose={() => setIsDVFormOpen(false)}
        onSubmit={handleDVFormSubmit}
        isSubmitting={createDVAssignment.isPending}
      />

      <PublicRightVehicleAssignmentForm
        isOpen={isPRVFormOpen}
        onClose={() => setIsPRVFormOpen(false)}
        onSubmit={handlePRVFormSubmit}
        isSubmitting={createPRVAssignment.isPending}
      />

      <PublicRightRenterAssignmentForm
        isOpen={isPRRFormOpen}
        onClose={() => setIsPRRFormOpen(false)}
        onSubmit={handlePRRFormSubmit}
        isSubmitting={createPRRAssignment.isPending}
      />

      {/* Close Assignment Dialogs */}
      <CloseAssignmentDialog
        isOpen={!!closingDVAssignment}
        onClose={() => setClosingDVAssignment(null)}
        onSubmit={handleCloseDVAssignment}
        isSubmitting={closeDVAssignment.isPending}
      />

      <CloseAssignmentDialog
        isOpen={!!closingPRVAssignment}
        onClose={() => setClosingPRVAssignment(null)}
        onSubmit={handleClosePRVAssignment}
        isSubmitting={closePRVAssignment.isPending}
      />

      <CloseAssignmentDialog
        isOpen={!!closingPRRAssignment}
        onClose={() => setClosingPRRAssignment(null)}
        onSubmit={handleClosePRRAssignment}
        isSubmitting={closePRRAssignment.isPending}
      />
    </div>
  );
}
