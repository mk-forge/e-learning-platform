import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    try {
      const courses = await prisma.course.findMany({
        include: {
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return new Response(JSON.stringify(courses), { status: 200 });
    } catch (error) {
      console.error("Chyba pri ziskavani kurzu:", error);
      return new Response(JSON.stringify({ error: "Chyba pri ziskavani kurzu" }), { status: 500 });
    }
  }  

export async function POST(req) {
    try {
      const body = await req.json();
      const { title, description, teacherId, capacity, isPremium, hasAds } = body;
  
      if (!title || !teacherId) {
        return new Response(
          JSON.stringify({ error: "Pole title a teacherId jsou povinne!" }),
          { status: 400 }
        );
      }
  
      const newCourse = await prisma.course.create({
        data: {
          title,
          description: description || null,
          teacherId,
          capacity: capacity || null,
          isPremium: isPremium ?? false,
          hasAds: hasAds ?? true
        },
      });
  
      return new Response(JSON.stringify(newCourse), { status: 201 });
    } catch (error) {
      console.error("Chyba pri pridavani kurzu:", error);
      return new Response(
        JSON.stringify({ error: "Nepodarilo se pridat kurz" }),
        { status: 500 }
      );
    }
  }  

export async function PUT(req) {
    try {
      const body = await req.json();
      const { id, title, description, teacherId } = body;
  
      const updatedCourse = await prisma.course.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          teacherId,
        },
      });
  
      return new Response(JSON.stringify(updatedCourse), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Nepodarilo se upravit kurz" }), { status: 400 });
    }
  }  

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { courseId } = body;

    await prisma.course.delete({
      where: { id: parseInt(courseId) },
    });

    return new Response(JSON.stringify({ message: "Kurz byl smazan" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Nepodarilo se smazat kurz" }), { status: 400 });
  }
}
