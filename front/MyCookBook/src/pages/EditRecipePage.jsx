import { useParams } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';

const EditRecipePage = () => {
  const { id } = useParams();

  return (
    <div>
      <RecipeForm recipeId={id} />
    </div>
  );
};

export default EditRecipePage;
