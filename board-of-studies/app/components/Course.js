const Course = ({ data }) => {
    return (
        <div>
            Name: {data.course_name}
            Credits: {data.lect_points + data.tut_points + data.pract_points}
            Course Code: {data.course_code}
        </div>
    )
}

export default Course