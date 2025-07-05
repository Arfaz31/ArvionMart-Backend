import config from '../config'
import { UserRole } from '../modules/User/user.contant'
import { User } from '../modules/User/user.model'

const superUser = {
  userId: 'Super-001',
  email: config.super_admin_email,
  contactNumber: config.super_admin_contact_number,
  password: config.super_admin_password,
  needPasswordChange: false,
  role: UserRole.superAdmin,
  status: 'ACTIVE',
  isDeleted: false,
}

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await User.findOne({ role: UserRole.superAdmin })
  if (!isSuperAdminExist) {
    await User.create(superUser)
    console.log('Super admin created successfully')
  } else {
    console.log('Super admin already exist')
  }
}

export default seedSuperAdmin
