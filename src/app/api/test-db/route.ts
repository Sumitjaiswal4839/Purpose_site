import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection by querying user count
    const templateCount = await prisma.templateConfig.count();
    
    // Try creating a test record
    const testTemplate = await prisma.templateConfig.create({
      data: {
        templateId: `test-${Date.now()}`,
        templateName: 'Test Template',
        description: 'This is a test template to verify database connection',
        isActive: true,
      },
    });

    // Delete the test record
    await prisma.templateConfig.delete({
      where: { id: testTemplate.id },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: '✅ Database connection is working!',
        details: {
          templateCountBefore: templateCount,
          testCreatedAt: testTemplate.createdAt,
          testDeletedSuccessfully: true,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Database test failed:', errorMessage);
    
    return NextResponse.json(
      {
        status: 'error',
        message: '❌ Database connection failed',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
