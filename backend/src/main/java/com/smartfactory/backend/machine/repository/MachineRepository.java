package com.smartfactory.backend.machine.repository;

import com.smartfactory.backend.machine.domain.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MachineRepository extends JpaRepository<Machine, String> {

}