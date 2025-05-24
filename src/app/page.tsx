import { Routes } from '@/constants/routes.constants';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs';

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

const HomePage = async (props: HomePageProps) => {
  redirect(Routes.DASHBOARD);
};

export default HomePage;
