package kukuxer.KuKushop.aspect;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Aspect
@Component
public class ControllerLogger {

    private static final AtomicInteger callCount = new AtomicInteger(0);

    @Before("execution(* kukuxer.KuKushop.controller..*(..))")
    public void logControllerMethods(JoinPoint joinPoint) {

        int count = callCount.incrementAndGet();

        // ANSI color codes
        final String GREEN = "\u001B[32m";
        final String BLUE = "\u001B[34m";
        final String RESET = "\u001B[0m";

        String color = (count % 2 == 0) ? BLUE : GREEN;
        String methodName = joinPoint.getSignature().toShortString();

        System.out.println(color + "[Controller Logger]: " + methodName + " " + count + RESET);
    }
}
