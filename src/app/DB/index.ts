import config from '../config';
import { USER_ROLES } from '../modules/user/user.constant';
import { UserModel } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'mailbox.sabit@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: 'superAdmin',
  status: 'active',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const existingSuperAdmin = await UserModel.findOne({
    role: USER_ROLES.superAdmin,
  });

  if (!existingSuperAdmin) {
    await UserModel.create(superUser);
  }
};

export default seedSuperAdmin;
