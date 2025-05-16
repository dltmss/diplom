from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # хешированная строка
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, default="user", nullable=False)  # 'user', 'admin', 'superadmin'
    position = Column(String, nullable=True)
    
    # Будет использоваться позже, когда сделаем логирование
    data_logs = relationship("DataLog", back_populates="user", lazy="selectin")


class DataLog(Base):
    __tablename__ = "data_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_fullname = Column(String, nullable=False)  # 👈 автоматически подставляется
    action = Column(String, nullable=False)
    parameter = Column(JSON, nullable=True)  # 👈 dict вместо строки
    file_name = Column(String, nullable=True)

    user = relationship("User", back_populates="data_logs")


class Finance(Base):
    __tablename__ = "finance"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    equipment_name = Column(String, nullable=False)
    energy = Column(Float)
    effectiveness = Column(Float)
    bcd_total = Column(Float)
    income = Column(Integer)
    expense = Column(Integer)
    benefit = Column(Integer)

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    asic = Column(Integer)
    fan = Column(Integer)
    core = Column(Integer)
    memory = Column(Integer)
    disk = Column(Integer)
    energy_vt = Column(Integer)
    energy_kvt = Column(Integer)
    hashrate = Column(Integer)
    effectiveness = Column(Integer)
    uptime = Column(Integer)
    hw_error = Column(Integer)
    active = Column(Integer)