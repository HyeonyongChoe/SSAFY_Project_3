package com.a205.beatween.domain.user.repository;

import com.a205.beatween.domain.space.entity.UserSpace;
import com.a205.beatween.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

}
