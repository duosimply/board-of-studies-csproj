import { createClient } from "../utils/supabase/server";
import Course from "./Course";

const SemBox = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Courses").select("*");

  console.log(data);
  console.log(error);

  return (
    <div>
      <div>Sem 1</div>
      {data.map((course) => {
        return <Course data={course} />;
      })}
    </div>
  );
};

export default SemBox;
