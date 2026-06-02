import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Upload from '../pages/Upload';
import MainLayout from '../layouts/MainLayout';
import NoPageFound from '../pages/NoPageFound';
import ProtectedRoute from '@/components/ProtectedRoutes';
import Invite from '@/pages/Invite';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import TestimonialsPage from '@/pages/TestimonialsPage';
import Profile from '@/pages/Profile';
import Folders from '@/pages/Folders';
import FolderDetail from '@/pages/FolderDetail';
import PublicProfile from '@/pages/PublicProfile';
import PublicFolder from '@/pages/PublicFolder';
import TestAddToFolderModal from '@/pages/TestAddToFolderModal';
import TestBackgroundModal from '@/pages/TestBackgroundModal';

const MainRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />

				<Route
					path="gallery"
					element={
						<ProtectedRoute>
							<Gallery />
						</ProtectedRoute>
					}
				/>
				<Route
					path="upload"
					element={
						<ProtectedRoute>
							<Upload />
						</ProtectedRoute>
					}
				/>
				<Route
					path="folders"
					element={
						<ProtectedRoute>
							<Folders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="folders/:folderId"
					element={
						<ProtectedRoute>
							<FolderDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="invite"
					element={
						<ProtectedRoute>
							<Invite />
						</ProtectedRoute>
					}
				/>
				<Route
					path="pricing"
					element={
						<ProtectedRoute>
							<Pricing />
						</ProtectedRoute>
					}
				/>
				<Route
					path="profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				
				{/* Public Routes */}
				<Route path="u/:username" element={<PublicProfile />} />
				<Route path="u/:username/folder/:folderId" element={<PublicFolder />} />
				<Route path="contact" element={<Contact />} />
				<Route path="about" element={<About />} />
				<Route path="testimonials" element={<TestimonialsPage />} />
				<Route path="terms" element={<Terms />} />
				<Route path="privacy" element={<Privacy />} />
				<Route path="policy" element={<Privacy />} />
				
				{/* Test Routes */}
				<Route path="test/add-to-folder-modal" element={<TestAddToFolderModal />} />
				<Route path="test/background-modal" element={<TestBackgroundModal />} />

				<Route path="*" element={<NoPageFound />} />
			</Route>
		</Routes>
	);
};

export default MainRoutes;
