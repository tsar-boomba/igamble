import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';

const CreatePost = () => {
	return (
		<Layout blog>
			<h1>Create a Post</h1>
			<PostForm create />
		</Layout>
	);
};

export default CreatePost;
