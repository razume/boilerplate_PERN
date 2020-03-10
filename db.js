const pg = require('pg');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/schools_db'
);

client.connect();

const sync = async () => {
  const SQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        DROP TABLE IF EXISTS student;
        DROP TABLE IF EXISTS school;
        CREATE TABLE school(
            school_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            school_name VARCHAR(40) NOT NULL
        );
        CREATE TABLE student(
            student_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            student_name VARCHAR(25) NOT NULL,
            enrollment_status BOOL NOT NULL,
            school_id UUID REFERENCES school(school_id)
        );
    `;
  await client.query(SQL);

  const school1 = await createSchool({ schoolName: 'FSU' });
  await createStudent({
    studentName: 'Leighton',
    enrollmentStatus: true,
    schoolId: school1.school_id
  });
};

const readSchool = async () => {
  return (await client.query('SELECT * FROM school')).rows;
};

const readStudent = async () => {
  return (await client.query('SELECT * FROM student')).rows;
};

const createSchool = async ({ schoolName }) => {
  const SQL = 'INSERT INTO school(school_name) VALUES($1) RETURNING *';
  return (await client.query(SQL, [schoolName])).rows[0];
};

const createStudent = async ({ studentName, enrollmentStatus, schoolId }) => {
  const SQL =
    'INSERT INTO student(student_name, enrollment_status, school_id) VALUES($1, $2, $3) RETURNING *';
  return (await client.query(SQL, [studentName, enrollmentStatus, schoolId]))
    .rows[0];
};

module.exports = {
  sync,
  createSchool,
  createStudent,
  readSchool,
  readStudent
  //   updateSchool,
  //   updateStudent,
  //   deleteSchool,
  //   deleteStudent
};
