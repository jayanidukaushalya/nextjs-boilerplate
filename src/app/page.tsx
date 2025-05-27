import { redirect } from 'next/navigation';

import { Routes } from '@/constants/routes.constants';

const HomePage = () => {
  redirect(Routes.DASHBOARD);
};

export default HomePage;
