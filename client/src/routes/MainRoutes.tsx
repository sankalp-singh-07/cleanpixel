import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Upload from '../pages/Upload';
import MainLayout from '../layouts/MainLayout';
import NoPageFound from '../pages/NoPageFound';

const MainRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="/gallery" element={<Gallery />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/upload" element={<Upload />} />
				<Route path="*" element={<NoPageFound />} />
			</Route>
		</Routes>
	);
};

export default MainRoutes;
