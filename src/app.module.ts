import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Project } from './projects/entities/project.entity';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Events } from './events/entities/events.entity';

@Module({
  imports: [
    // load the .env file and make it available in the entire application
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // connect to the database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, Project, Events],
      synchronize: true, // setting to true to auto create tables (dev only)
    }),
    UsersModule,
    ProjectsModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
