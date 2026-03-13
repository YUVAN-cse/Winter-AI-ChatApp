import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'
import { Avatar, Button } from '../components/ui'
import { UserIcon, MailIcon, CalendarIcon, TrashIcon, ShieldIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return }
    setDeleting(true)
    try {
      await authService.deleteAccount()
      toast.success('Account deleted')
      navigate('/login')
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
      setConfirming(false)
    }
  }

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className={styles.page}>
      {/* Background grid */}
      <div className={styles.gridBg} />

      <div className={styles.container}>
        {/* Profile card */}
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <Avatar name={user?.name || ''} size="lg" />
            <div>
              <h1 className={styles.name}>{user?.name}</h1>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Account details</h2>
          <div className={styles.infoList}>
            <InfoRow icon={UserIcon}     label="Name"    value={user?.name} />
            <InfoRow icon={MailIcon}     label="Email"   value={user?.email} />
            <InfoRow icon={CalendarIcon} label="Joined"  value={joinedDate} />
            <InfoRow icon={ShieldIcon}   label="Role"    value="Member" />
          </div>
        </div>

        {/* Danger zone */}
        <div className={`${styles.card} ${styles.danger}`}>
          <h2 className={styles.sectionTitle} style={{ color: '#fc8181' }}>Danger zone</h2>
          <p className={styles.dangerText}>
            Permanently delete your account and all conversation data. This cannot be undone.
          </p>
          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDelete}
          >
            <TrashIcon size={14} />
            {confirming ? 'Are you sure? Click again to confirm' : 'Delete my account'}
          </Button>
          {confirming && !deleting && (
            <button className={styles.cancel} onClick={() => setConfirming(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}>
        <Icon size={14} />
      </div>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}
