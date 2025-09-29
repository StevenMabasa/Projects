import java.util.*;

public class PrimeNumber {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num = scanner.nextInt();
            
            if (num==1 || num==2) {
                System.out.println("Prime");
            }

            else {
                for (int i=2; i<num; i++) {
                    if (num%i==0) {
                        System.out.println("Not Prime");
                        break;
                    }
                    else {
                        if (i==(num-1)) {
                            System.out.println("Prime");
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        }
    }
}
