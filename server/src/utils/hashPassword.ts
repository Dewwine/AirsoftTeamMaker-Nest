import * as bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export default hashPassword;
