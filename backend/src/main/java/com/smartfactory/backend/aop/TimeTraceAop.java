package com.smartfactory.backend.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Aspect
public class TimeTraceAop {

    @Around("execution(* com.smartfactory.backend..*(..)) && !target(com.smartfactory.backend.config.SpringConfig)")     // SpringConfig 제외 모든 Point 체크
    public Object execute(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        System.out.println("START TIME: " + joinPoint.toString());
        try {
            return joinPoint.proceed();
        } finally {
            long finish = System.currentTimeMillis();
            long timeMs = (finish - start);
            System.out.println("END TIME: " + joinPoint.toString() + " " + timeMs + " ms");
        }
    }
}
